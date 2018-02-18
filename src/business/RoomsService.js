import PubSubEvent from "./PubSubEvent";
import SectionedPubSubEvent from "./SectionedPubSubEvent";
import Room from "../models/Room";

class RoomsService {
    static NO_ROOM = -1;

    constructor(connection) {
        this._connection = connection;
        this._rooms = new Map();
        this._roomUsers = new Map();
        this._selectedRoom = RoomsService.NO_ROOM;

        this.onRoomSelect = new PubSubEvent();
        this.onRoomDataChange = new SectionedPubSubEvent();
        this.onRoomUsersChange = new SectionedPubSubEvent();
        this.onRoomlistChange = new PubSubEvent();

        connection.onEvent.listen("roomlist", data => {
            this._rooms.clear();
            for (const roomRaw of data.rooms) {
                const room = Object.assign(new Room(), roomRaw);
                this._rooms.set(room.id, room);
                this.onRoomDataChange.notify(room.id, room);
            }
            this.onRoomlistChange.notify(this.getRooms());
            this._switchRoomIfNecessary();
        });
        connection.onEvent.listen("roomUserlist", data => {
            const users = data.users.map(obj => obj.id); // ids are nested in objects
            this._roomUsers.set(data.roomID, users);
            this.onRoomUsersChange.notify(data.roomID, users);
        });
    }

    _switchRoomIfNecessary() {
        const room = this.getRoomForID(this.getSelectedRoomID());
        if (room === undefined || !room.inRoom) {
            // not in room anymore, switch to some other room
            for (const room of this.getRooms()) {
                if (room.inRoom && !room.hasPW) {
                    this.selectRoom(room.id);
                    return;
                }
            }
            this.selectRoom(RoomsService.NO_ROOM);
        }
    }

    getRooms() {
        return Array.from(this._rooms.values());
    }

    getRoomForID(roomID) {
        return this._rooms.get(roomID);
    }

    getUserIDsForRoom(roomID) {
        return this._roomUsers.get(roomID) || [];
    }

    getSelectedRoomID() {
        return this._selectedRoom;
    }

    selectRoom(roomID) {
        if (roomID === this._selectedRoom) return;
        this._selectedRoom = roomID;
        this.onRoomSelect.notify(roomID);
    }

    joinRoom(roomID, password) {
        this._connection.send("chatRoom", {
            "action": "enter",
            "roomID": roomID,
            "password": password || ""
        });
    }

    leaveRoom(roomID) {
        this._connection.send("chatRoom", {
            "action": "leave",
            "roomID": roomID
        });
    }
}

export default RoomsService;
