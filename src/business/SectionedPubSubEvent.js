
class SectionedPubSubEvent {
    constructor() {
        const callbacks = new Map();

        this.listen = (section, callback) => {
            if (!callbacks.has(section)) callbacks.set(section, []);
            callbacks.get(section).push(callback);
        };
        this.unlisten = (section, callback) => {
            if (callbacks.has(section)) {
                const callbacksSection = callbacks.get(section);
                const index = callbacksSection.indexOf(callback);
                if (index >= 0) callbacksSection.splice(index, 1);
            }
        };
        this.notify = (section, ...args) => {
            if (callbacks.has(section)) {
                for (const callback of callbacks.get(section)) {
                    callback(...args);
                }
            }
        };
    }
}

export default SectionedPubSubEvent;
