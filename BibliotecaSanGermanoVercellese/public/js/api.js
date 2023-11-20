"use strict";

//Classe che comunica rirettamente con la REST API tramite delle fetch
class Api{

    //Utente

    static signupUtente = async(username, password) => {
        let response = await fetch('/api/signup/utenti', {
            method : 'post',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                "user": username,
                "password" : password
            })
        });

        return await response.json();
    }

    static loginUtente = async (username, password) => {
        let response = await fetch('/api/login/utenti', {
            method : 'post',
            headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                "username" : username,
                "password" : password
            })
        });

        return await response.json();
    }

    static logoutUtente = async () => {
        let response = await fetch('/api/logout/utenti/current', {
            method : 'delete',
        });

        return await response.json();
    }

    static createUtenteProfile = async(utente) => {
        let response = await fetch('/api/utenti',{
            method : 'post',
            headers : {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(utente)
        });

        return await response.json();
    }

    static getUtenteByID = async (profileID) => {
        let response = await fetch('/api/utenti/' + profileID, {
            method : 'get',
            headers : {
                'Accept': 'application/json'
            }
        });

        return await response.json();
    }

    //Curatore

    static loginCuratore = async (username, password) => {
        let response = await fetch('/api/login/curatori', {
            method : 'post',
            headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                "username" : username,
                "password" : password
            })
        });

        return await response.json();
    }

    static logoutCuratore = async () => {
        let response = await fetch('/api/logout/curatori/current', {
            method : 'delete',
        });

        return await response.json();
    }

    //Book

    static getAllBooks = async (filterQuery) => {
        let url = "/api/books";

        if (filterQuery) url += "?" + filterQuery;

        try {
            let response = await fetch(url, {
              method: 'get',
              headers: {
                'Accept': 'application/json'
              }
            });
        
            if (!response.ok) {
              throw new Error('Errore nella richiesta API');
            }
        
            return await response.json();
          } catch (error) {
            console.error(error);
            throw error;
          }
    }; 

    static getBookByISBN = async (isbn) => {
        let response = await fetch('/api/books/'+ isbn, {
            method: 'get',
            headers: {
                'Accept': 'application/json'
            }
        });

        return await response.json();
    }

    static createBook = async(book, image) => {

        let imagePath = null;
        if(image != undefined){
            let data = new FormData();
            data.append('file',image);
            imagePath = await fetch('/api/media/images', {
                method: 'post',
                body: data
            });
        }

        book.filepath = (imagePath != null) ? (await imagePath.json())['filePath'] : null;

        let response = await fetch('/api/books',{
            method:'post',
            headers:{
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(book)
        });

        return await response.json();
    }

    static modifyBook = async(book) => {
        let response = await fetch('/api/books',{
            method:'put',
            headers:{
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(book)
        });

        return await response.json();
    }

    //Event

    static getAllEvents = async () => {
        let response = await fetch('/api/events', {
            method: 'get',
            headers: {
                'Accept':'application/json'
            }
        });

        return await response.json();
    };

    static createEvent = async(event, image) => {
        let imagePath = null;
        if(image != undefined){
            let data = new FormData();
            data.append('file',image);
            imagePath = await fetch('/api/media/images', {
                method: 'post',
                body: data
            });
        }

        event.filepath = (imagePath != null) ? (await imagePath.json())['filePath'] : null;

        let response = await fetch('/api/events',{
            method:'post',
            headers:{
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(event)
        });

        return await response.json();
    }

    //Reservation

    static createReservation = async(reservation) => {

        let response = await fetch('/api/reservations', {
            method : 'post',
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(reservation)
        });

        return await response.json();
    }

    static getAllReservations = async () => {
        let response = await fetch('/api/reservations', {
            method: 'get',
            headers: {
                'Accept':'application/json'
            }
        });

        return await response.json();
    };

    static getReservationsByID = async (profileID) => {

        let response = await fetch('/api/reservations/' + profileID, {
            method: 'get',
            headers: {
                'Accept':'application/json'
            }
        });

        return await response.json();
    };

    static deleteReservation = async (profileID,isbn) => {
        let response = await fetch('/api/reservations/' + profileID + '/' + isbn, {
            method : 'delete',
            headers : {
                'Accept' : 'application/json'
            }
        });

        return await response.json();
    }
}