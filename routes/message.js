const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

module.exports = (params) => {
    const { messageController } = params;

    //Route POST pour l'envoi du message
    router.post('/', [
        check('title').trim().isLength({ min: 3 }).escape().withMessage('Le titre doit contenir au moins 3 caractères'),
        check('content').trim().isLength({ min: 3 }).escape().withMessage('Le message doit contenir au moins 3 caractères'),
        check('name').trim().isLength({ min: 3 }).escape().withMessage('Le nom doit contenir au moins 3 caractères'),
    ], async (req, res, next) => {


        const erreurs = validationResult(req);
        let messages = {};
        if(!erreurs.isEmpty()) {
            messages = { erreurs: erreurs.array()};
            console.log("Erreur d'envoi du message")

            res.render('layouts', {
                pageTitle: 'Message non envoyé',
                page: 'index',
                messages: messages.erreurs
            })
        } else {
            const {title, content, name } = req.body;
            await messageController.addPost({title, content, name});
            console.log("Message envoyé")
        }

        res.render('layouts', {
            pageTitle: 'Message envoyé',
            page: 'index',
            post: req.body
        })
    })

    return router
}