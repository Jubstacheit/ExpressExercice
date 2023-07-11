const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class MainController {
    constructor(data) {
        this.dataFile = `./data/${data}.json`;
    }
}

module.exports = MainController;