import PubSubEvent from "./PubSubEvent";

class ChatService {
    constructor(connection) {
        this._connection = connection;
        this.onMessage = new PubSubEvent();
        this._connection.onEvent.listen("chat", this.onMessage.notify);
    }

    sendMessage(roomID, message) {
        this._connection.send("chat", {
            roomID: roomID,
            msg: message
        });
    }
}

export default ChatService;
