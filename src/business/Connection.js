
class Connection {
    static eventColor = "color: green; font-weight: bold;";

    constructor(url) {
        this._websocket = null;
        this._url = url;
        this._onEventCallbacks = new Map();
    }

    connect() {
        this._websocket = new WebSocket(this._url);

        this._websocket.onopen = event => {
            this._onReceiveEvent("open", event);
        };
        this._websocket.onclose = event => {
            this._onReceiveEvent("close", event);
        };
        this._websocket.onerror = event => {
            this._onReceiveEvent("error", event);
        };
        this._websocket._onMessageCallbacks = event => {
            const data = JSON.parse(event.data);
            const type = data.type;
            delete data.type;
            this._onReceiveEvent(type, data);
        };
    }

    send(type, data) {
        console.log("%cSending%c event %c%s%c with data: %O",
            "color: DarkGoldenrod; font-weight: bold;", "", this.eventColor, type, "", Object.assign({}, data));
        data["type"] = type;
        this._websocket.send(JSON.stringify(data));
    }

    _onReceiveEvent(type, data) {
        console.log("%cReceiving%c event %c%s%c with data: %O",
            "color: DarkOrchid; font-weight: bold;", "", this.eventColor, type, "", data);
        if (this._onEventCallbacks.has(type)) {
            for (const callback of this._onEventCallbacks.get(type)) {
                callback(data);
            }
        } else {
            console.warn("There are no listeners for the %c%s%cevent!", this.eventColor, type, "")
        }
    }

    listen(type, callback) {
        if (!this._onEventCallbacks.has(type)) {
            this._onEventCallbacks.set(type, []);
        }
        this._onEventCallbacks.get(type).push(callback);
    }

    unlisten(type, callback) {
        if (this._onEventCallbacks.has(type)) {
            const callbacks = this._onEventCallbacks.get(type);
            const index = callbacks.indexOf(callback);
            if (index >= 0) callbacks.splice(index, 1);
        }
    }

}

export default Connection;
