"use strict";

// Import dei moduli necessari
const express = require('express');
const {check, oneOf, validationResult} = require('express-validator');
const morgan = require('morgan');

// Import dei router definiti in altri file
const {loginRouter} = require('./routes/loginRouter');
const appDataRouter = require('./routes/appDataRouter');
const filesRouter = require('./routes/filesRouter');

// Creazione dell'app Express
const app = express();
app.use(morgan('tiny'));
app.use(express.json());

// Configurazione dei router
app.use('/api', loginRouter);     
app.use('/api', appDataRouter); 
app.use('/api/media', filesRouter);

app.use(express.static(__dirname + '/public'));

const PORT = 3000;

app.get('/', (req, res) => {
    res.redirect('index.html');
});

app.get('*', (req, res) => {
    res.redirect('index.html');
})

// Avvio del server sulla porta specificata
app.listen(PORT, () => console.log(`magic happening on port ${PORT}`));
