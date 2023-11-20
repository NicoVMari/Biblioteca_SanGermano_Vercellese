"use strict";

const sqlite = require('sqlite3');

class ApplicationDAO {
    constructor() {
        this.DBSOURCE = './data/applicationData.db';
        this.db = new sqlite.Database(this.DBSOURCE, (err) => {
            if (err) {
                console.error(err);
                throw err;
            }

            console.log("Application-data Database Opened Succesfully");
        });
    }

    // Utente

    //Inserisce un nuovo utente dentro Utente
    insertNewUtente(utente) {
        console.log("Received:", utente);
        return new Promise((resolve,rejects) => {
            const sql = "INSERT INTO Utente VALUES (?, ?, ?, ?, ?, ?, ?)";
            this.db.run(sql, [utente.profileID, utente.name, utente.surname, utente.age, utente.city, utente.province, utente.contacts], function(err) {
                if(err) return rejects({"error": err});
                return resolve({"profileID":this.lastID});
            });
        });
    }

    //Restituisc un utente dato il profileID
    getUtenteByID(profileID){
        return new Promise((resolve,rejects) => {
            const sql = "SELECT * FROM Utente WHERE ProfileID = ?";
            this.db.get(sql, [profileID], function(err,row){
                if(err) return rejects({"error" : err});
                if(row == undefined) return resolve({"error": `No Utente with profileID (${profileID}) found`});
                return resolve(row);
            });
        });
    }

    //Book

    //Inserisce un nuovo libro dentro Book
    insertNewBook(book){
        console.log("Received:", book);
        return new Promise((resolve,reject) =>{
            const sql = "INSERT INTO Book VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            this.db.run(sql,[book.isbn,book.titolo,book.autore,book.editore,book.disponibilita,book.genere,book.anno_pubblicazione,book.descrizione,book.filepath], function(err){
                if (err) return reject({"error": err});
                return resolve({"ISBN": this.isbn});
            });
        });
    }

    //Modifica un libro dentro Book
    updateBook(book){
        return new Promise((resolve,reject) => {
            const sql = "UPDATE Book Set Titolo = ?, Autore = ?, Editore = ?, Disponibilita = ?, Genere = ?, Anno_pubblicazione = ?, Descrizione = ?, Filepath = ? WHERE ISBN = ?";
            this.db.run(sql,[book.Titolo,book.Autore,book.Editore,book.Disponibilita,book.Genere,book.Anno_pubblicazione,book.Descrizione,book.Filepath, book.ISBN], function(err){
                if (err) return reject({"error": err});
                return resolve({"changes": this.changes});
            });
        });
    }

    //Restituisce tutti i libri
    getAllBook(){
        return new Promise((resolve,reject) => {
            const sql = "SELECT * FROM Book";
            this.db.all(sql, function(err,row){
                if (err) return reject({"error": err});
                if (row == undefined) return resolve({"error":"No book fuound"});
                return resolve(row);
            });
        });
    }

    //Restituisce un libro dato l'ISBN
    getBookByISBN(isbn){
        return new Promise((resolve,reject) => {
            const sql = "SELECT * FROM Book WHERE ISBN = ?";
            this.db.get(sql,[isbn], function(err,row){
                if (err) return reject({"error":err});
                if (row == undefined) return resolve({"error":`No Book with ISBN (${isbn}) found`});
                return resolve(row);
            });
        });
    }

    //Event

    //Inserisce un nuovo evento dentro Event
    insertNewEvent(event){
        console.log("Received:", event);
        return new Promise((resolve,reject) => {
            const sql = "INSERT INTO Event (Titolo, Giorno, Descrizione, Filepath) VALUES (?, ?, ?, ?)";
            this.db.run(sql, [event.titolo,event.giorno,event.descrizione,event.filepath], function(err){
                if (err) return reject({"error":err});
                return resolve({"eventId ": this.lastID});
            });
        });
    }

    //Restituisce tutti gli eventi
    getAllEvent(){
        return new Promise((resolve,reject) => {
            const sql = "SELECT * FROM Event";
            this.db.all(sql,function(err,row){
                if (err) return reject({"error": err});
                if (row == undefined) return resolve({"error": "No event found"});
                return resolve(row);
            });
        });
    }

    //Reservation

    //Inserisce una nuova prenotazione dentro Reservation
    insertNewReservation(reservation){
        console.log("Received:", reservation);
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO Reservation VALUES (?, ?, ?)";
            this.db.run(sql, [reservation.utente, reservation.libro, reservation.giorno], function (err) {
                if (err) return reject({ "error": err });
                return resolve({ "success": true });
            });
        });
    }

    //Restituisce tutti le pronotazioni
    getAllReservation(){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM Reservation";
            this.db.all(sql, function (err, rows) {
                if (err) return reject({ "error": err });
                if (rows === undefined || rows.length === 0) return resolve({ "error": "No reservations found" });
                return resolve(rows);
            });
        });
    }

    //Restituisce le pronotazioni dato il profileID
    getReservationByID(profileID) {
        return new Promise((resolve, reject) => {
          const sql = "SELECT * FROM Reservation WHERE Utente = ?";
          this.db.all(sql, [parseInt(profileID)], function (err, rows) {
            if (err) return reject({ "error": err });
            if (rows.length === 0) return resolve({ "error": "No reservations found" });
            return resolve(rows);  // Restituisci l'array rows invece di un singolo oggetto row
          });
        });
      }      

    //Elimina la pronotazione dati profileID e Isbn
    removeReservation(profileID,isbn){
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM Reservation WHERE Utente = ? AND Libro = ?";
            this.db.run(sql, [profileID, isbn], function (err) {
                if (err) return reject({ "error": err });
                return resolve({ "success": true });
            });
        });
    }
}

module.exports = ApplicationDAO;