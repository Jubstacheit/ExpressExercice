const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

module.exports = (params) => {
    // on récupère le controller de server.js via les params
    const { messageController } = params;

    //Route GET index
    router.get('/', (req, res) => {

        // try catch pour gérer les erreurs si jamais le controller ne fonctionne pas
        try {
            // on récupère tous les messages via le controller
            const loadMessages = messageController.loadEntry();

            // une fois qu'on les a, on les affiches
            loadMessages.then((loadedMessages) => {
                res.render('layouts', {
                    pageTitle: `Index`,
                    page: "index",
                    messages: loadedMessages
                })
            })
            console.log("Index chargé")
        } catch (err) {
            console.error(err);
            res.render('layouts', {
                pageTitle: `Une erreur s'est produite`,
                page: "erreur",
                error: {
                    general: err
                }
            })
        }
    })

    //Route POST pour l'envoi du message
    router.post('/', [
        // check si le message est conforme
        check('title').trim().isLength({ min: 3 }).escape().withMessage('Le titre doit contenir au moins 3 caractères'),
        check('content').trim().isLength({ min: 3 }).escape().withMessage('Le message doit contenir au moins 3 caractères'),
        check('name').trim().isLength({ min: 3 }).escape().withMessage('Le nom doit contenir au moins 3 caractères'),
    ], async (req, res, next) => {

        // on récupère les erreurs
        const erreurs = validationResult(req);
        let messages = {};

        // si on a une erreur, on l'affiche à l'utilisateur
        if (!erreurs.isEmpty()) {
            messages = { erreurs: erreurs.array() };
            console.log("Erreur d'envoi du message")
            console.log(messages)

            // on passe les erreurs pour créer un objet error
            let errorObject = {};
            messages.erreurs.forEach((erreur) => {
                errorObject[erreur.path] = erreur.msg;
            })

            // on récupère quand même tous les messages via le controller
            const loadMessages = messageController.loadEntry(); 

            console.log("youhouuuu")

            try {
                loadMessages.then((loadedMessages) => {
                    res.render('layouts', {
                        pageTitle: 'Message non envoyé',
                        page: 'index',
                        // error: messages.erreurs,
                        error: errorObject,
                        messages: loadedMessages
                    })
                })
                console.log("Erreur d'envoi du message")

            } catch (err) {
                console.error(err);
                res.render('layouts', {
                    pageTitle: `Une erreur s'est produite`,
                    page: "erreur",
                    error: { general: err }
                })
            }
            
        // sinon on envoie le message
        } else {
            console.log("Message envoyé")

            const { title, content, name } = req.body;
            await messageController.addEntry({ title, content, name });
            console.log("Message envoyé")

            // on récupère quand même tous les messages via le controller
            const loadMessages = messageController.loadEntry();

            try {
                loadMessages.then((loadedMessages) => {
                    res.render('layouts', {
                        pageTitle: 'Message envoyé',
                        page: 'index',
                        messages: loadedMessages
                    })
                })
                console.log("Message envoyé")

            }
            catch (err) {
                console.error(err);
                res.render('layouts', {
                    pageTitle: `Une erreur s'est produite`,
                    page: "erreur",
                    error: { general: err }
                })
            }
            
        }
    })


    // 404 page 
    router.use('/', (req, res) => {
        res.render('layouts', {
            pageTitle: "Cette page n'existe pas",
            err: false,
            page: "erreur"
        })
    }
    )

    return router;
}