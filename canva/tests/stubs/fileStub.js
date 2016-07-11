export default class FileStub {

    constructor(parts = [], filename = '', properties = {}) {
        this.name = filename;
        this.type = properties.type;
        this.size = 0;
    }
}
