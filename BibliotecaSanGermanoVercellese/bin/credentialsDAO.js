"use strict";

const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');

class CredentialsDAO {
    constructor(){
        this.DBSOURCE = './data/applicationData.db';
        this.db = new sqlite.Database(this.DBSOURCE, (err) => {
            if(err){
                console.error(err);
                throw err;
            }

            console.log("Credential Database Opened Correctly");
        });
    }

    //Credenziali Utente


    //Inserisce un nuovo utente dentro UserCredentials
    insertNewUser(utente){
        return new Promise(async (resolve,reject) => {
            const sql = "INSERT INTO  UserCredentials (User, Password) VALUES (?, ?)";
            const hash = await bcrypt.hash(utente.password, 10);

            this.db.run(sql, [utente.user, hash], function(err) {
                if (err) return reject({"error" : err});
                return resolve(this.lastID);
            });
        });
    }

    //Restituisce un utente dati user e password
    getUserCredentials(user, password) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM UserCredentials WHERE User = ?";
            this.db.get(sql, [user], function(err, row) {
                if (err) return reject({"error" : err});
                if (row === undefined) return resolve({"error" : "user not found"});

                const user = {"profileID" : row.ProfileID, "user" : row.User};
                const check = bcrypt.compareSync(password, row.Password);
                return resolve({user, check});
            });
        });
    }

    //Restituisce un utente dato l'Id
    getUserCredentialsByID(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM UserCredentials WHERE ProfileID = ?";
            this.db.get(sql, [id], function(err, row) {
                if (err) return reject({"error" : err});
                if (row === undefined) return resolve({"error" : `no user found with ProfileID (${id})`});
                return resolve({"profileID" : row.ProfileID, "user" : row.User});
            });
        });
    }

    //Credenziali Curatore

    //Restituisce un curatore dati user e password
    getCuratoreCredentials(user, password) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM CuratoreCredentials WHERE User = ?";
            this.db.get(sql, [user], function(err, row) {
                if (err) return reject({"error" : err});
                if (row === undefined) return resolve({"error" : "user not found"});

                const user = {"profileID" : row.ProfileID, "user" : row.User};
                const check = bcrypt.compareSync(password, row.Password);
                return resolve({user, check});
            });
        });
    }

    //Restituisce un curatore dato l'Id
    getCuratoreCredentialsByID(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM CuratoreCredentials WHERE ProfileID = ?";
            this.db.get(sql, [id], function(err, row) {
                if (err) return reject({"error" : err});
                if (row === undefined) return resolve({"error" : `no user found with ProfileID (${id})`});
                return resolve({"profileID" : row.ProfileID, "user" : row.User});
            });
        });
    }

}

module.exports = CredentialsDAO;