
class ChatService {
    constructor(connection) {
        this._connection = connection;
        this._onMessageCallbacks = [];
        this._connection.listen("chat", data => {
            this._onMessageCallbacks.forEach(callback => callback(data))
        });
    }

    listenOnMessage(callback) {
        this._onMessageCallbacks.push(callback);
    }

    unlistenOnMessage(callback) {
        const index = this._onMessageCallbacks.indexOf(callback);
        if (index >= 0) this._onMessageCallbacks.splice(index, 1);
    }

    sendMessage(roomID, message) {
        this._connection.send("chat", {
            roomID: roomID,
            msg: message
        });
    }
}

export default ChatService;
