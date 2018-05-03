
class PubSubEvent {
    constructor() {
        const callbacks = [];

        this.listen = callback => callbacks.push(callback);
        this.unlisten = callback => {
            const index = callbacks.indexOf(callback);
            if (index >= 0) callbacks.splice(index, 1);
        };
        this.notify = (...args) => callbacks.forEach(callback => callback(...args));
        this.countListeners = () => callbacks.length;
    }
}

export default PubSubEvent;
