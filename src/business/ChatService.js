
class ChatService {
    constructor(connection) {
        this.connection = connection;
        this.onmessage = [];
        this.connection.listen("chat", data => this.onmessage.forEach(callback => callback(data)));
    }

    listenOnMessage(callback) {
        this.onmessage.push(callback);
    }

    unlistenOnMessage(callback) {
        const index = this.onmessage.indexOf(callback);
        if (index >= 0) this.onmessage.splice(index, 1);
    }

    sendMessage(roomID, message) {
        this.connection.send("chat", {
            roomID: roomID,
            msg: message
        });
    }
}

export default ChatService;
