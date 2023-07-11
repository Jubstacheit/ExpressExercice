const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function loadMessage(){
    try {
        const data = await readFile(this.dataFile);
        if (data.length === 0) {
            return []
        }
        return JSON.parse(data);
    } catch (err) {
        console.log(err);
        return []
    }
}

async function saveMessage(messages) {
    try {
        const data = JSON.stringify(messages, null, 2);
        await writeFile(this.dataFile, data);
        console.log('Message posté et sauvegardé')
    } catch (err) {
        console.log(err)
    }
}

class MessageController{
    constructor(data){
        this.dataFile = `./data/${data}.json`;
    }

    async getIndexPage (req, res) {
        try {
            const messages = await loadMessage.call(this);
            res.render ('index', {messages})
        } catch (err) {
            console.error(err)
            res.status(500).send(err)
        }
    }

    async postMessage (req, res) {
        const { title, message, name } = req.body;
        const newMessage = { title, message, name };

        try {
            const message = await loadMessage.call(this);
            message.push(newMessage);
            await saveMessage.call(this, message);
            res.redirect('/');
        } catch (err) {
            console.error(err)
            res.status(500).send(err)
        }
    }
}

module.exports = MessageController;