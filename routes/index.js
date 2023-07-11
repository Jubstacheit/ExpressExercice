const express = require('express');
const router = express.Router();

module.exports = (params) => {
    router.get('/', (req, res) => {
        try{
            res.render('layouts', {pageTitle: `Index`, page: "index"})
        } catch (err) {
            res.render('layouts', {
                pageTitle: `Une erreur s'est produite`,
                page: "erreur",
                err: err})
        }
    })

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