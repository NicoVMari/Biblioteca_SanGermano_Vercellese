"use strict";

// Import dei moduli necessari
const express = require('express');
const loginRouter = express.Router();

const {check, oneOf, validationResult} = require('express-validator');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const Credentials_DB_Manager = require('../bin/credentialsDAO');
const credentialsDAO = new Credentials_DB_Manager();

//Strategia di autenticazione per un utente
passport.use('utenteLocalStrategy', new LocalStrategy(async function(username, password, done){
    credentialsDAO.getUserCredentials(username,password).then(({user,check}) => {
        if(!user) return done(null, false, {"error" : {"field" : "username", "message" : "Username non corretto"}});
        if (!check) return done(null, false, {"error" : {"field" : "password", "message" : "Password non corretta"}});

        user.type = "UTENTE";
        return done(null,user);
    });
}));

//Strategia di autenticazione per un curatore
passport.use('curatoreLocalStrategy', new LocalStrategy(async function(username, password, done){
    credentialsDAO.getCuratoreCredentials(username,password).then(({user,check}) => {
        if(!user) return done(null, false, {"error" : {"field" : "username", "message" : "Username non corretto"}});
        if (!check) return done(null, false, {"error" : {"field" : "password", "message" : "Password non corretta"}});

        user.type = "CURATORE";
        return done(null,user);
    });
}));

//Serializzazione dell'utente per memorizzarlo nella sessione
passport.serializeUser(function(user,done){
    done(null,{"profileID": user.profileID, "type" : user.type});
});

//Deserializzazione dell'utente dalla sessione
passport.deserializeUser(async function(user,done){
    let logOutUser;
    try {
        if(user.type === "UTENTE"){
            logOutUser = await credentialsDAO.getUserCredentialsByID(user.profileID);
            logOutUser.type = "UTENTE";
        }

        if(user.type === "CURATORE"){
            logOutUser = await credentialsDAO.getCuratoreCredentialsByID(user.profileID);
            logOutUser.type = "CURATORE";
        }
        
        return done(null,logOutUser)
    } catch (err) {
        return done(err,logOutUser);
    }
});

// Configurazione di sessione e autenticazione
loginRouter.use(session({
    "secret" : "secret sententce that should be saved in a separate file!",
    "resave" : false,
    "saveUninitialized" : false,
    "cookie" : {
        "httpOnly" : true
    }
}));

loginRouter.use(passport.initialize());
loginRouter.use(passport.session());

// Middleware per verificare l'autenticazione dell'utente
const utenteIsLoggedIn = function(req,res,next){
    if(req.isAuthenticated() && req.user.type === "UTENTE") return next();
    return res.status(401).json({"statusCode" : 401, "message" : "not authenticated as a valid Utente"});
}

// Middleware per verificare l'autenticazione del curatore
const curatoreIsLoggedIn = function(req,res,next){
    if(req.isAuthenticated() && req.user.type === "CURATORE") return next();
    return res.status(401).json({"statusCode" : 401, "message" : "not authenticated as a valid Curatore"});
}

// Middleware per verificare l'autenticazione di utente o curatore
const utenteOrCuratoreIsLoggedIn = function(req, res, next) {
    if (req.isAuthenticated() && (req.user.type === "UTENTE" || req.user.type === "CURATORE")) return next();
    return res.status(401).json({"statusCode" : 401, "message" : "not authenticated as a valid Utente or a valid Curatore"});
}

//Utente routes

// Registrazione di un nuovo utente
loginRouter.post('/signup/utenti', [
    oneOf([
        check("user").isLength({"min" : 5}).withMessage("username must have a length of at least 5 characters"),
        check("user").isEmail().withMessage("username must be a valid name or a valid email")
    ]),
    check("password").isLength({"min" : 6}).withMessage("password must be at least 6 characters long")

    ], async (req, res, next) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});

        let data;
        try {
            data = await credentialsDAO.insertNewUser(req.body);
            if (data.err) return res.status(200).json({"error" : data.err});
            return res.status(200).json({"profileID" : data});
        } catch (err) {
            return res.status(500).json({"error" : err});
        }
    }
);

// Login di un utente
loginRouter.post('/login/utenti', [
        oneOf([
            check("username").isLength({"min" : 5}).withMessage("username must have a length of at least 5 characters"),
            check("username").isEmail().withMessage("username must be a valid name or a valid email")
        ]),
        check("password").isLength({"min" : 6}).withMessage("password must be at least 6 characters long")
    ], (req, res, next) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});

        passport.authenticate('utenteLocalStrategy', (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).json(info);
            req.login(user, (err) => {
                if (err) return next(err);
                return res.json(req.user);
            })
        }) (req, res, next);
    }
);

// Logout di un utente
loginRouter.delete('/logout/utenti/current', utenteIsLoggedIn, (req,res) => {
    let loggedOut = null;
    if(req.user != undefined) loggedOut = {"profileID": req.user.profileID, "username": req.user.user};
    console.log("Received delete from; ", loggedOut);
    req.logout ((err) => {
        if(err) return next(err);
    });
    if (loggedOut != null) return res.status(200).json({"correctly logged-out utente" : loggedOut});
});

//Curatore routes

// Login di un curatore
loginRouter.post('/login/curatori', [
        oneOf([
            check("username").isLength({"min" : 5}).withMessage("username must have a length of at least 5 characters"),
            check("username").isEmail().withMessage("username must be a valid name or a valid email")
        ]),
        check("password").isLength({"min" : 6}).withMessage("password must be at least 6 characters long")
    ], (req, res, next) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});

        passport.authenticate('curatoreLocalStrategy', (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).json(info);
            req.login(user, (err) => {
                if (err) return next(err);
                return res.json(req.user);
            })
        }) (req, res, next);
    }
);

// Logout di un curatore
loginRouter.delete('/logout/curatori/current', curatoreIsLoggedIn, (req,res) => {
    let loggedOut = null;
    if(req.user != undefined) loggedOut = {"profileID": req.user.profileID, "username": req.user.user};
    console.log("Received delete from; ", loggedOut);
    req.logout ((err) => {
        if(err) return next(err);
    });
    if (loggedOut != null) return res.status(200).json({"correctly logged-out curatore" : loggedOut});
});

// Esportazione del router e dei middleware
module.exports.loginRouter = loginRouter;
module.exports.utenteIsLoggedIn = utenteIsLoggedIn;
module.exports.curatoreIsLoggedIn = curatoreIsLoggedIn;
module.exports.utenteOrCuratoreIsLoggedIn = utenteOrCuratoreIsLoggedIn;