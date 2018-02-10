import ChatService from "./ChatService";
import UsersService from "./UsersService";

class OCS {
    constructor(connection) {
        this.connection = connection;
        this.chatService = new ChatService(connection);
        this.usersService = new UsersService(connection);
    }
}

export default OCS;
