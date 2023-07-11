const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const port = 3000;

//Router et controllers
const router = require('./routes');
const MainController = require('./controllers/MainController');
const mainController = new MainController("main");

const app = express();

//Fichiers statiques
app.use(express.static(path.join(__dirname, '/public')));

// Middleware pour récupérer les données de formulaire
app.use(bodyParser.urlencoded({extended: true}));

// Engine EJS et vues
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'));


//Route pour soumettre le formulaire
app.post('/message', (req, res) => {
    console.log(req.body);
    res.render('contact', {data: req.body});
})

//Config
fs.readFile(path.join(__dirname, './data/config.json'), 'utf8', (err, data) => {
    if (err) {
        console.error("Erreur de lecture du fichier de configuration", err);
        app.locals.siteName = '[nom du site]';
    } else {
        console.log("Config chargée")
        app.locals.siteName = JSON.parse(data).siteName;
    }
});

//Controllers
app.use('/', router({
    mainController
}))

//Lancement du serveur et logs
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`)
})
app.use((req, res, next) => {
    console.log(`Time : ${Date.now()}, ${req.method} ${req.url}`)
    next();
})