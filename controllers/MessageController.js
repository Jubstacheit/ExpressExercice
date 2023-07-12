const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class MessageController{
    constructor(data){
        this.dataFile = `./data/${data}.json`;
    }

    async loadPost(){
        const data = await readFile(this.dataFile);
        if(!data) return ['Aucun message'];
    }

    async addEntry({title, content, name}) {
        const data = (await this.loadPost()) || [];
        data.unshift({title, content, name});

        return writeFile(this.dataFile, JSON.stringify(data));
    }
}

module.exports = MessageController;