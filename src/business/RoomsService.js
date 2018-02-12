import PubSubEvent from "./PubSubEvent";
import SectionedPubSubEvent from "./SectionedPubSubEvent";
import Room from "../models/Room";

class RoomsService {
    static NO_ROOM = -1;

    constructor(connection) {
        this._rooms = new Map();
        this._roomUsers = new Map();
        this._selectedRoom = RoomsService.NO_ROOM;

        this.onRoomSelect = new PubSubEvent();
        this.onRoomChange = new SectionedPubSubEvent();
        this.onRoomlistChange = new PubSubEvent();

        let initialized = false;
        connection.onEvent.listen("roomlist", data => {
            this._rooms.clear();
            for (const roomRaw of data.rooms) {
                const room = Object.assign(new Room, roomRaw);
                if (!initialized && room.inRoom) {
                    // join some room by default
                    this.selectRoom(room.id);
                    initialized = true;
                }
                this._rooms.set(room.id, room);
                this.onRoomChange.notify(room.id);
            }
            this.onRoomlistChange.notify(this.getRooms());
        });
        connection.onEvent.listen("roomUserlist", data => {
            this._roomUsers.set(data.roomID, data.users.map(obj => obj.id)); // ids are nested in objects
            this.onRoomChange.notify(data.roomID);
        });
    }

    getRooms() {
        return Array.from(this._rooms.values());
    }

    getUserIDsForRoom(roomID) {
        return this._roomUsers.get(roomID) || [];
    }

    selectRoom(roomID) {
        if (roomID === this._selectedRoom) return;
        this._selectedRoom = roomID;
        this.onRoomSelect.notify(roomID);
    }
}

export default RoomsService;
