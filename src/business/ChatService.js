import SectionedPubSubEvent from "./SectionedPubSubEvent";

class ChatService {
    constructor(connection, roomsService) {
        this._connection = connection;
        this._roomsService = roomsService;
        this._messages = new Map();
        this.onMessage = new SectionedPubSubEvent();

        this._onMessage = this._onMessage.bind(this);
        this._onRoomlistChange = this._onRoomlistChange.bind(this);

        this._connection.onEvent.listen("chat", this._onMessage);
        this._roomsService.onRoomlistChange.listen(this._onRoomlistChange);
    }

    _onMessage(message) {
        if (!this._messages.has(message.roomID)) {
            this._messages.set(message.roomID, []);
        }
        this._messages.get(message.roomID).push(message);
        this.onMessage.notify(message.roomID, message);
    }

    _onRoomlistChange(rooms) {
        // discard chat data for rooms that aren't joined.
        const joinedRoomIDs = new Set(rooms
            .filter(room => room.inRoom)
            .map(room => room.id));
        for (const roomID of Array.from(this._messages.keys())) {
            if (!joinedRoomIDs.has(roomID)) {
                this._messages.delete(roomID)
            }
        }
    }

    getMessagesForRoomID(roomID) {
        return Array.from(this._messages.get(roomID) || []);
    }

    sendMessage(roomID, message) {
        this._connection.send("chat", {
            roomID: roomID,
            msg: message
        });
    }
}

export default ChatService;
