export default class FileReaderStub {

    constructor() {
        this.eventListeners = {};
    }

    addEventListener(eventName, cb) {
        if (!this.eventListeners[eventName]) {
            this.eventListeners[eventName] = [];
        }

        this.eventListeners[eventName].push(cb);
    }

    readAsDataURL(file) {
        this.result = 'data:';
        this.eventListeners.load.forEach((cb) => cb());
    }
}
