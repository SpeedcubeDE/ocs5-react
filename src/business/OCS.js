import ChatService from "./ChatService";
import UsersService from "./UsersService";
import RoomsService from "./RoomsService";
import I18nService from "./I18nService";
import PartiesService from "./PartiesService";

export default class OCS {
    constructor(connection) {
        this.connection = connection;
        this.roomsService = new RoomsService(connection);
        this.chatService = new ChatService(connection, this.roomsService);
        this.usersService = new UsersService(connection);
        this.i18nService = new I18nService();
    }
}
