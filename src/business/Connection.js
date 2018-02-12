import SectionedPubSubEvent from "./SectionedPubSubEvent";

class Connection {
    static eventColor = "color: green; font-weight: bold;";

    constructor(url) {
        this._websocket = null;
        this._url = url;
        this.onEvent = new SectionedPubSubEvent();
    }

    connect() {
        this._websocket = new WebSocket(this._url);

        this._websocket.onopen = event => {
            this.onEvent.notify("open", event);
        };
        this._websocket.onclose = event => {
            this.onEvent.notify("close", event);
        };
        this._websocket.onerror = event => {
            this.onEvent.notify("error", event);
        };
        this._websocket.onmessage = event => {
            const data = JSON.parse(event.data);
            const type = data.type;
            delete data.type;
            console.log("%cReceiving%c event %c%s%c with data: %O",
                "color: DarkOrchid; font-weight: bold;", "", Connection.eventColor, type, "", data);
            this.onEvent.notify(type, data);
        };
    }

    send(type, data) {
        console.log("%cSending%c event %c%s%c with data: %O",
            "color: DarkGoldenrod; font-weight: bold;", "", Connection.eventColor, type, "", Object.assign({}, data));
        data["type"] = type;
        this._websocket.send(JSON.stringify(data));
    }
}

export default Connection;
