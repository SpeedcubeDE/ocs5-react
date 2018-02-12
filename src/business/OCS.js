import ChatService from "./ChatService";
import UsersService from "./UsersService";
import RoomsService from "./RoomsService";

class OCS {
    constructor(connection) {
        this.chatService = new ChatService(connection);
        this.usersService = new UsersService(connection);
        this.roomsService = new RoomsService(connection);
    }
}

export default OCS;
