"use strict";

// Import dei moduli necessari
const express = require('express');
const appDataRouter = express.Router();

const {check, oneOf, validationResult, checkSchema} = require('express-validator');

const AppData_DB_Manager = require('../bin/applicationDAO');
const appDataDAO = new AppData_DB_Manager();

const {utenteIsLoggedIn, curatoreIsLoggedIn, utenteOrCuratoreIsLoggedIn} = require('./loginRouter');

appDataRouter.use(express.json());

//Check inserimento utente
const insertUtenteChecks = checkSchema({
    "name" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'name'"
    },
    "surname" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'surname'"
    },
    "age" : {
        "in" : ["body"],
        "exists" : true,
        "isNumeric" : true,
        "errorMessage" : "req.body must contain the field 'age'"
    },
    "city" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'city'"
    },
    "province" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'province'"
    },
    "contacts" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'contacts'"
    },
});

//Check inserimento o modifica book
const insertOrUpdateBookChecks = checkSchema({
    "isbn" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'isbn'"
    },
    "titolo" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'titolo'"
    },
    "autore" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'autore'"
    },
    "editore" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'editore'"
    },
    "genere" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'genere'"
    },
    "anno_pubblicazione" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'anno_pubblicazione'"
    },
    "descrizione" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'descrizione'"
    },
    "filepath" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'filepath'"
    },
});

//Check inserimento event
const insertEventChecks = checkSchema({
    "titolo" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'titolo'"
    },
    "giorno" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'giorno'"
    },
    "descrizione" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'descrizione'"
    },
    "filepath" : {
        "in" : ["body"],
        "exists" : true,
        "errorMessage" : "req.body must contain the field 'filepath'"
    },
});

/* ===== Custom Functions ===== */

//Restituisce data odierna
function getCurrentDate() {
    return new Date(Date.now()).toISOString().split('T')[0];
}

//Filtra i dati in base ai parametri passati
function filterData(paramsArray, data) {
    if (paramsArray.length == 0) return data;

    for (let filterParam in paramsArray) {
        data = data.filter(row => {
            if (row[filterParam] === undefined) return true;
            return row[filterParam].toLowerCase().includes(paramsArray[filterParam].toLowerCase());
        });
    }

    return data;
}  

//Utente

// Inserimento di un utente
appDataRouter.post('/utenti', utenteIsLoggedIn, [
        insertUtenteChecks,
        checkSchema({
            "profileID" : {
                "in" : ["body"],
                "exists" : true,
                "isNumeric" : true,
                "errorMessage" : "req.body must contain the field 'profileID', corresponding to a valid ProfileID of an Authenticated Utente account"
            }
        })
    ], async(req, res) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});

        let data;
        try {
            data = await appDataDAO.insertNewUtente(req.body);
            if (data.error) return res.status(200).json({"message" : data.error});
            return res.status(200).json({"profileID" : data.profileID});
        } catch (err) {
            return res.status(500).json({"error" : err});
        }
    }
);

// Restituisce un utente dato il utenteID
appDataRouter.get('/utenti/:utenteID', [check("utenteID").exists().withMessage("a utenteID is required").isNumeric().withMessage("utenteID must be a number")], async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});

    let data;
    try {
        data = await appDataDAO.getUtenteByID(req.params.utenteID);
        if (data.error) return res.status(200).json({"message" : `no utenti with ProfileID (${req.params.utenteID})`});
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({"error" : err});
    }
});

//Book

// Inserisce un libro
appDataRouter.post('/books', curatoreIsLoggedIn, [insertOrUpdateBookChecks], async(req,res) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});

    let data;
    try {
        data = await appDataDAO.insertNewBook(req.body);
        if(data.error) return res.status(200).json({"message": data.error});
        return res.status(200).json({"ISBN": data.isbn});
    } catch (err) {
        res.status(500).json({"error" : err});
    }
});


// Restutuisce tutti i libri e in caso li filtra
appDataRouter.get('/books', [
    check("ISBN").optional(true).isString().withMessage("Titolo must be a string"),
    check("Titolo").optional(true).isString().withMessage("Titolo must be a string"),
    check("Autore").optional(true).isString().withMessage("Autore must be a string"),
    check("Editore").optional(true).isString().withMessage("Editore must be a string"),
    check("Genere").optional(true).isString().withMessage("Genere must be a string"),
    check("Anno_pubblicazione").optional(true).isString().withMessage("Anno_pubblicazione must be a number")

],async (req, res) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) return res.status(200).json({"validation errors": validationErrors.array()});

    let data;
    try {
        data = await appDataDAO.getAllBook();
        if(data.error) return res.status(200).json({"message": "no book found"});

        data = filterData(req.query, data);

        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({"error": err});
    }
}
);
  
// Modifica un libro
appDataRouter.put('/books', utenteOrCuratoreIsLoggedIn,  async (req,res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});
    let data;
    try {
        data = await appDataDAO.updateBook(req.body);
        if (data.error) return res.status(200).json({"message" : data.error});
        return res.status(200).json({"total changes" : data.changes});
    } catch (err) {
        return res.status(500).json({"error" : err});
    }
});

// Restituisce il libro dato l'ISBN
appDataRouter.get('/books/:ISBN', [check("ISBN").exists().withMessage("ISBN viene richiesto").isNumeric().withMessage("ISBN must be a number")], async(req,res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});

    let data;
    try {
        data = await appDataDAO.getBookByISBN(req.params.ISBN);
        if (data.error) return res.status(200).json({"message" : `no book with ISBN (${req.params.ISBN})`});
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({"error" : err});
    }
})

//Event

// Inserisce un evento
appDataRouter.post('/events', curatoreIsLoggedIn, [insertEventChecks], async(req,res) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});

    let data;
    try {
        data = await appDataDAO.insertNewEvent(req.body);
        if(data.error) return res.status(200).json({"message": data.error});
        return res.status(200).json({"Id": data.Id});
    } catch (err) {
        res.status(500).json({"error" : err});
    }
});

// Restituisce tutti gli eventi
appDataRouter.get('/events', async (req,res) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) return res.status(422).json({"validation errors": validationErrors.array()});

    let data;
    try {
        data = await appDataDAO.getAllEvent();
        if (data.error) return res.status(200).json({"message" : "no event found"});

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({"error": err});
    }
}
);

//Reservation

// Inserisce una prenotazione
appDataRouter.post('/reservations', utenteOrCuratoreIsLoggedIn, async(req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});
  
    req.body.utente = req.body.utente;
    req.body.libro = req.body.libro; 
    req.body.giorno = getCurrentDate();

    let data;
    try {
        data = await appDataDAO.insertNewReservation(req.body);
        if (data.error) return res.status(200).json({"message" : data.error});
        return res.status(200).json({"Utente" : data.profileID, "Libro": data.isbn});
    } catch (err) {
        res.status(500).json({"error":err});
    }
});

// Restituisce prontazione date profileID oppure tutte
appDataRouter.get('/reservations', utenteOrCuratoreIsLoggedIn, async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({ "validation errors": validationErrors.array() });
    }
  
    let data = [];
    try {
        data = await appDataDAO.getAllReservation();
        if (data.error) return res.status(200).json({ "message": data.error });
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ "error": err });
    }
    
  });

// Restituisce prontazione date profileID oppure tutte
appDataRouter.get('/reservations/:profileID', utenteOrCuratoreIsLoggedIn, async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({ "validation errors": validationErrors.array() });
    }
  
    let data = [];
    
    try {
        data = await appDataDAO.getReservationByID(req.params.profileID);
        if (data.error) return res.status(200).json({ "message": data.error });
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ "error": err });
    }
  });


// Elimina una prenotazione
appDataRouter.delete('/reservations/:profileID/:isbn',  [
    check("profileID").exists().withMessage("a profileID is required").isNumeric().withMessage("profileID must be a number"),
    check("isbn").exists().withMessage("a ISBN is required").isString().withMessage("ISBN must be a string")
], curatoreIsLoggedIn, async(req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) return res.status(422).json({"validation errors" : validationErrors.array()});

    let profileID = parseInt(req.params.profileID);
    let isbn = req.params.isbn;

    try {

        let userReservation = await appDataDAO.getReservationByID(profileID);

        if (userReservation.error) return res.status(200).json({"message" : userReservation.error});

        let found = false;
        for(let reservation of userReservation){
            if(reservation.Utente == profileID && reservation.Libro == isbn ){
                found = true;
                break;
            }
        }

        if (!found) return res.status(401).json({"error" : "not authorized to remove an reservetion"});

        let data = await appDataDAO.removeReservation(profileID,isbn);
        if (data.error) return res.status(200).json({"message": data.error});
        return res.status(200).json({"changes": data.success});
    } catch(err) {
        return res.status(500).json({"error" : err});
    }
});

// Esportazione del router 
module.exports = appDataRouter;