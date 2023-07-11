const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

module.exports = (params) => {
    const { messageController } = params;

    router.get('/', async (req, res) => {
        try {
            await messageController.getIndexPage(req, res);
        } catch (err) {
            console.error(err)
            res.status(500).send(err)
        }
    })

    router.post('/', [
        check('title').trim().isLength({ min: 3 }).escape().withMessage('Le titre doit contenir au moins 3 caractères'),
        check('message').trim().isLength({ min: 5 }).escape().withMessage('Le message doit contenir au moins 5 caractères'),
        check('name').trim().isLength({ min: 3 }).escape().withMessage('Le nom doit contenir au moins 3 caractères')
    ], async (req, res) => {
        try {
            const erreurs = validationResult(req);
            if(!erreurs.isEmpty()) {
                const errorMessages = erreurs.array().map(err => err.msg);
                throw new Error(errorMessages.join('\n'));
            }

            await messageController.postMessage(req, res);
        } catch (err) {
            console.error(err)
            res.status(500).send(err)
        }
    })

    return router
}