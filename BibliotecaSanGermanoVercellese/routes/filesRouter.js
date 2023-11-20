"use strict";

// Import dei moduli necessari
const express = require('express');
const fileRouter = express.Router();

const { curatoreIsLoggedIn } = require('./loginRouter');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Configurazione dello storage per il caricamento delle immagini
const imagesStorage = multer.diskStorage({
    filename: function (req, file, callback) {
        if (file.mimetype != "image/png" && file.mimetype != "image/jpg" && file.mimetype != "image/jpeg"
        ) {
            return callback("Only .png, .jpg and .jpeg formats allowed");
        }

        const fileName = uuidv4();
        callback(null, fileName);
    },

    destination: function (req, file, callback) {
        callback(null, __dirname + '/../public/media/images');
    }
});

// Funzione per convertire il percorso del file
function convertFilePath(path) {
    return path.split('public')[1];
}

const imagesUpload = multer({ "storage": imagesStorage });

// Caricamento delle immagini
fileRouter.post('/images', curatoreIsLoggedIn, (req, res) => {
    imagesUpload.single('file')(req, res, function (err) {
        if (err) return res.status(415).json({ "error": err });
        if (req.file === undefined) return res.status(400).json({ "error": "no file was sent for upload" });
        return res.status(200).json({ "filePath": convertFilePath(req.file.path) });
    });
});

module.exports = fileRouter;
