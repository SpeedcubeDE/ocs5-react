import ChatService from "./ChatService";
import UsersService from "./UsersService";
import RoomsService from "./RoomsService";
import I18nService from "./I18nService";

class OCS {
    constructor(connection) {
        this.chatService = new ChatService(connection);
        this.usersService = new UsersService(connection);
        this.roomsService = new RoomsService(connection);
        this.i18nService = new I18nService();
    }
}

export default OCS;
