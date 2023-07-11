const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);


class MessagesController {
    constructor(data) {
        this.dataFile = `./data/${data}.json`;
    }

    async loadMessages() {
        const data = await readFile(this.dataFile);
        if (!data) return [];
    }

    async addMessage(title, message, name) {
        const data = (await this.loadMessages()) || [];
        data.unshift({title, message, name});

        return writeFile(this.dataFile, JSON.stringify(data))
    }
}

module.exports = MessagesController;