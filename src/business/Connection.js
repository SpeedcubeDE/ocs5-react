
class Connection {
    eventColor = "color: green; font-weight: bold;";

    constructor(url) {
        this.websocket = null;
        this.url = url;
        this.callbacks = new Map();
    }

    connect() {
        this.websocket = new WebSocket(this.url);

        this.websocket.onopen = event => {
            this.receive("open", event);
        };
        this.websocket.onclose = event => {
            this.receive("close", event);
        };
        this.websocket.onerror = event => {
            this.receive("error", event);
        };
        this.websocket.onmessage = event => {
            const data = JSON.parse(event.data);
            const type = data.type;
            delete data.type;
            this.receive(type, data);
        };
    }

    send(type, data) {
        console.log("%cSending%cevent%c%s%cwith data: %O",
            "color: DarkGoldenrod; font-weight: bold;", "", this.eventColor, type, "", Object.assign({}, data));
        data["type"] = type;
        this.websocket.send(JSON.stringify(data));
    }

    receive(type, data) {
        console.log("%cReceiving%cevent%c%s%cwith data: %O",
            "color: DarkOrchid; font-weight: bold;", "", this.eventColor, type, "", data);
        if (this.callbacks.has(type)) {
            for (const callback of this.callbacks.get(type)) {
                callback(data);
            }
        } else {
            console.warn("There are no listeners for the %c%s%cevent!", this.eventColor, type, "")
        }
    }

    listen(type, callback) {
        if (!this.callbacks.has(type)) {
            this.callbacks.set(type, []);
        }
        this.callbacks.get(type).push(callback);
    }

}

export default Connection;
