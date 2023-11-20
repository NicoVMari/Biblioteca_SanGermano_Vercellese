"use strict";

// Classe che gestisce la logica della pagina e viene utilizzata il client side rendering
class App{
    constructor(appContainer, navBtnToolbar){
        this.appContainer = appContainer;
        this.navBtnToolbar = navBtnToolbar;
        this.userLoggedIn = null;
        this.userProfile = null;

        this.homeListenersDefined = false;

        this.addLoginFormEventListeners();
        this.addSignupFormEventListeners();
        this.addUtenteFormEventListers();
        this.addBookFormEventListers();
        this.addEventFormEventListers();
        this.addReservationFormEventListers();

        page('/home', () => {
            this.appContainer.innerHTML = '';
            this.showHomePage();
        });

        page('/events', () => {
            this.appContainer.innerHTML = '';
            this.showEventPage();
        });

        page('/reservations', () => {
            this.appContainer.innerHTML = '';
            this.showReservationPage();
        });

        page('/informations', () => {
            this.appContainer.innerHTML = '';
            this.showInformationPage();
        });

        page('/profile', () => {
            this.appContainer.innerHTML = '';
            this.showProfilePage();
        });

        page('*', () => {
            page('/home');
        });

        page();
    }

    showHomePage(){
        this.appContainer.innerHTML = createHomePage();

        if(this.homeListenersDefined == true) return;

        document.getElementById('home-page-btn').addEventListener('click', () => {
            page('/home');
        });

        document.getElementById('event-page-btn').addEventListener('click', () => {
            page('/events');
        });

        document.getElementById('reservation-page-btn').addEventListener('click', () => {
            page('/reservations');
        });

        document.getElementById('information-page-btn').addEventListener('click', () => {
            page('/informations');
        });

        document.getElementById('home-page-footer').addEventListener('click', () => {
            page('/home');
        });

        document.getElementById('event-page-footer').addEventListener('click', () => {
            page('/events');
        });

        document.getElementById('reservation-page-footer').addEventListener('click', () => {
            page('/reservations');
        });

        document.getElementById('information-page-footer').addEventListener('click', () => {
            page('/informations');
        });

        this.homeListenersDefined = true;
    }

    shiwtchNavbarButtons(){
        this.navBtnToolbar.innerHTML = '';

        if(this.userLoggedIn == null){
            this.navBtnToolbar.innerHTML = createLoginButton();
            return;
        };

        this.navBtnToolbar.innerHTML = createProfileAndLogoutButtons();

        document.getElementById('logout').addEventListener('click', async(event) =>{
            event.preventDefault();

            let response;

            if (this.userLoggedIn['type'] === "UTENTE") response = await Api.logoutUtente();
            else if (this.userLoggedIn['type'] === "CURATORE") response = await Api.logoutCuratore();

            this.userLoggedIn = null;
            this.userProfile = null;

            this.shiwtchNavbarButtons();

            page('/home');
        });

        document.getElementById('view-profile').addEventListener('click', (event) => {
            event.preventDefault();

            page('/profile');
        });
    }

    addLoginFormEventListeners(){
        const loginForm = document.querySelector('#login-form');

        const typeUtente = document.querySelector('#login-form-type-utente');
        const typeCuratore = document.querySelector('#login-form-type-curatore');
        const radioErrorMessage = document.querySelector('#radio-error-message');

        typeUtente.addEventListener('click', event => {
            typeUtente.classList.add('form-type-selected');
            typeCuratore.classList.remove('form-type-selected');
            loginForm.elements['login-form-user-type'].value = "UTENTE";
        });

        typeCuratore.addEventListener('click', event => {
            typeUtente.classList.remove('form-type-selected');
            typeCuratore.classList.add('form-type-selected');
            loginForm.elements['login-form-user-type'].value = "CURATORE";
        });

        loginForm.addEventListener('submit', async(event) => {
            event.preventDefault();

            if (!typeUtente.checked && !typeCuratore.checked) {
                radioErrorMessage.innerText = "Seleziona un tipo di utente";
                return;
            } else {
                radioErrorMessage.innerText = "";
            }

            let userType = loginForm.elements['login-form-user-type'].value;
            let username = loginForm.elements['login-form-username-email'].value;
            let password = loginForm.elements['login-form-password'].value;

            let response;

            if(userType === 'UTENTE'){
                response = await Api.loginUtente(username,password);
            }
            else if(userType === "CURATORE"){
                response = await Api.loginCuratore(username,password);
            }

            if(response['error']){
                let error = response['error'];
                let username = loginForm.elements['login-form-username-email'];
                let password = loginForm.elements['login-form-password'];

                if (error.field === 'username') {
                    username.classList.add('is-invalid');
                    password.classList.remove('is-invalid');
                    document.getElementById('username-validity').innerText = error.message;
                }

                if (error.field === 'password') {
                    password.classList.add('is-invalid');
                    username.classList.remove('is-invalid');
                    document.getElementById('password-validity').innerText = error.message;
                }

                return;
            }

            this.userLoggedIn = response;

            this.shiwtchNavbarButtons();

            let loginModal = document.getElementById('login-modal');
            bootstrap.Modal.getInstance(loginModal).hide();

            loginForm.reset();

            page('/profile');
        });
    }   

    addSignupFormEventListeners(){
        const signupForm = document.querySelector('#signup-form');

        const modalsToggleButton = document.getElementById('modals-toggle-button');
        signupForm.elements['signup-form-user-type'].value = "UTENTE";
        modalsToggleButton.setAttribute("data-bs-target", "#utente-modal");

        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            let username = signupForm.elements['signup-form-username-email'].value;
            let password = signupForm.elements['signup-form-password'].value;

            let response = await Api.signupUtente(username, password);

            if (response['validation errors'] || response['error']) {
                return;
            }

            let user = await Api.loginUtente(username, password);

            this.userLoggedIn = user;

            this.shiwtchNavbarButtons();

            let signupModal = document.getElementById('signup-modal');
            bootstrap.Modal.getInstance(signupModal).hide();

            modalsToggleButton.click();
        });
    }

    addUtenteFormEventListers(){
        const utenteForm = document.querySelector('#utente-form');

        utenteForm.addEventListener('submit', async(event) => {
            event.preventDefault();

            const formElements = utenteForm.elements;

            let utente = {};

            utente.profileID = this.userLoggedIn.profileID;

            utente.name = formElements['utente-name'].value;
            utente.surname = formElements['utente-surname'].value;
            utente.age = parseInt(formElements['utente-age'].value);
            utente.city = formElements['utente-city'].value;
            utente.province = formElements['utente-province'].value;
            utente.contacts = formElements['utente-contacts'].value;

            let response = await Api.createUtenteProfile(utente);

            if(response['validation errors'] || response['error'] || response['message']){
                return;
            }

            let  utenteModal= document.getElementById('utente-modal');
            bootstrap.Modal.getInstance(utenteModal).hide();

            let formTitle = document.getElementById('utente-profile-creation-title');
            formTitle.innerText = "Creazione profilo Utente";

            let submitButton = document.getElementById('utente-profile-submit');
            submitButton.innerText = "Registrami";

            utenteForm.reset();

            page('/profile');
        });
    }

    async addBookFormEventListers(){
        const bookForm = document.querySelector('#book-form');

        bookForm.addEventListener('submit', async(event) =>{
            event.preventDefault();

            const formElements = bookForm.elements;
            let book = {};

            book.isbn = formElements['book-isbn'].value;
            book.titolo = formElements['book-titolo'].value;
            book.autore = formElements['book-autore'].value;
            book.editore = formElements['book-editore'].value;
            book.genere = formElements['book-genere'].value;
            book.anno_pubblicazione = formElements['book-anno_pubblicazione'].value;
            book.disponibilita = true;
            book.descrizione = formElements['book-descrizione'].value;
            let image = formElements['book-filepath'].files[0];

            let response = await Api.createBook(book,image); 

            if(response['validation errors'] || response['error'] || response['message'] ) {
                
                let error = response['error'];
                let isbn = bookForm.elements['book-isbn'];

                if (error.field === 'isbn') {
                    isbn.classList.add('is-invalid');
                    document.getElementById('isbn-validity').innerText = error.message;
                }

                return;
            }

            let bookModal = document.getElementById('book-modal');
            bootstrap.Modal.getInstance(bookModal).hide();

            bookForm.reset();

            page('/reservations');
            
        });
    }

    async addEventFormEventListers(){
        const eventForm = document.querySelector('#event-form');

        eventForm.addEventListener('submit', async(event) =>{
            event.preventDefault();

            const formElements = eventForm.elements;
            let evento = {};

            evento.titolo = formElements['event-titolo'].value;
            evento.giorno = formElements['event-giorno'].value;
            evento.descrizione = formElements['event-descrizione'].value;
           
            let image = formElements['event-filepath'].files[0];

            let response = await Api.createEvent(evento,image);

            if(response['error']) return;

            let eventModal = document.getElementById('event-modal');
            bootstrap.Modal.getInstance(eventModal).hide();

            eventForm.reset();

            page('/events');
            
        });
    }

    async addReservationFormEventListers(){
        const reservationForm = document.querySelector('#reservation-form');

        reservationForm.addEventListener('submit', async(event) =>{
            event.preventDefault();

            const formElements = reservationForm.elements;

            let reservation = {};

            reservation.utente = this.userLoggedIn.profileID;
            reservation.libro = formElements['btn-conferma'].getAttribute('book-isbn');

            let response = await Api.createReservation(reservation);

            if(response['error']) return;

            reservationForm.reset();

            let reservationModal = document.getElementById('reservation-modal');
            bootstrap.Modal.getInstance(reservationModal).hide();

            let book = await Api.getBookByISBN(reservation.libro);

            book.Disponibilita = false;

            let responseBook = await Api.modifyBook(book);
            if(responseBook['error']) return;

            page('/profile');

        });

    }

    async showEventPage(){
        this.appContainer.innerHTML = createEventPage();
        const eventList = document.getElementById("event-list");

        let events = await Api.getAllEvents();

        if(events.lenght == 0) eventList.innerHTML = "Non ci sono eventi";

        this.showDynamicCards(events,eventList,createEventCard,"col");
    }

    showDynamicCards(dinamicObj, listContainer, createDynamicCard,colClass){
        for (let i = 0; i < dinamicObj.length; i++) {
            let dynamicCard = createDynamicCard(dinamicObj[i]);
        
            let col = document.createElement('div');
            col.classList = colClass;
            col.innerHTML = dynamicCard;
        
            listContainer.appendChild(col);
          }
    }

    async showDynamicCarousel(books, carouselContainer, createCarouselItem) {
        const carouselInner = carouselContainer.querySelector('.carousel-inner');
      
        carouselInner.innerHTML = '';
        carouselContainer.querySelector('.carousel-indicators').innerHTML = '';

        const numBooks = books.length;
        const numItems = Math.ceil(numBooks / 4);
      
        for (let i = 0; i < numItems; i++) {
          const indicator = document.createElement('button');
          indicator.type = 'button';
          indicator.setAttribute('data-bs-target', '#carousel-book');
          indicator.setAttribute('data-bs-slide-to', i.toString());
          if (i === 0) {
            indicator.classList.add('active');
            indicator.setAttribute('aria-current', 'true');
          }
          carouselContainer.querySelector('.carousel-indicators').appendChild(indicator);
        }

        for (let i = 0; i < numItems; i++) {
          const item = document.createElement('div');
          item.classList.add('item');
          item.classList.add('carousel-item');
          if (i === 0) {
            item.classList.add('active');
          }
      
          const itemInner = document.createElement('div');
          itemInner.classList.add('row', 'custom-carousel');
      
          const startIndex = i * 4;
          const endIndex = Math.min(startIndex + 4, numBooks);
          for (let j = startIndex; j < endIndex; j++) {
            const book = books[j];
            const carouselItem = document.createElement('div');
            carouselItem.classList.add('col-sm-3');
            carouselItem.innerHTML = createCarouselItem(book,this.userLoggedIn);
            itemInner.appendChild(carouselItem);

            carouselItem.querySelector('.btn-dettagli').addEventListener('click', () => {
                showBookDetails(book);
            });

            carouselItem.querySelector('.btn-prenota').addEventListener('click', () => {
                showBookPrenota(book);
            });
          }
      
          item.appendChild(itemInner);
          carouselInner.appendChild(item);
        }
      }
      
    async showInformationPage(){
        this.appContainer.innerHTML = createInformationPage();
    }

    async showProfilePage(){
        if (this.userLoggedIn['type'] === "UTENTE") {
            let utente = await Api.getUtenteByID(this.userLoggedIn['profileID']);
            this.appContainer.innerHTML = createUtenteProfilePage(utente);
            this.userProfile = utente;

            this.createProfileReservationTab(this.userLoggedIn['profileID'], false);
        }
        else if (this.userLoggedIn["type"] === "CURATORE") {
            this.appContainer.innerHTML = createCuratoreProfilePage();

            this.createProfileReservationTab(this.userLoggedIn['profileID'], true);
        }
    }
    
    async showReservationPage() {
        const reservationPage = createReservationPage();
        this.appContainer.innerHTML = reservationPage;
      
        const booksList = document.getElementById("book-list");
      
        let books = await Api.getAllBooks();
      
        if (books.length == 0) {
            const message = document.createElement('p');
            message.textContent = 'Non ci sono libri disponibili';
            booksList.innerHTML = '';
            booksList.appendChild(message);
            return;
        }
      
        this.showDynamicCarousel(books, booksList, createCarouselItem);
      
        const filters = document.forms["book-page-filters"];
      
        filters.addEventListener("submit", async (event) => {
          event.preventDefault();
      
          const titolo = filters.elements['titolo-filter'].value;
          const autore = filters.elements['autore-filter'].value;
          const editore = filters.elements['editore-filter'].value;
          const genere = filters.elements['genere-filter'].value;
          const isbn = filters.elements['isbn-filter'].value;
          const anno_pubblicazione = filters.elements['anno_pubblicazione-filter'].value;

          let filteredBooks = await Api.getAllBooks(`ISBN=${isbn}&Titolo=${titolo}&Autore=${autore}&Editore=${editore}&Genere=${genere}&Anno_pubblicazione=${anno_pubblicazione}`);
          filteredBooks = filteredBooks;

            if (filteredBooks.length == 0) {

                const modal = new bootstrap.Modal(document.getElementById('ricerca-modal'));
                modal.show();
                page('/reservations');
                return;
            }
            else this.showDynamicCarousel(filteredBooks, booksList, createCarouselItem,this.userLoggedIn);
        });
    }

    async createProfileReservationTab(userID, isCuratore) {
        let reservationTab = document.getElementById('profile-reservation-tab-body');
      
        let reservations;
        if (!isCuratore) {
          reservations = await Api.getReservationsByID(userID);
        } else if (isCuratore) {
          reservations = await Api.getAllReservations();
        }
      
        if (!Array.isArray(reservations) || reservations.length === 0) {
          reservationTab.innerText = "\n\t\tNon ci sono prenotazioni";
          return;
        }

        let tableContainer = document.createElement('div');
        tableContainer.classList.add('table-responsive');
      
        let table = document.createElement('table');
        table.className = 'table table-hover';
      
        let thead = document.createElement('thead');
        let tr = document.createElement('tr');
        let th0 = document.createElement('th');
        th0.scope = 'col';
        th0.innerText = '#';
        let th1 = document.createElement('th');
        th1.scope = 'col';
        th1.innerText = 'Email';
        let th2 = document.createElement('th');
        th2.scope = 'col';
        th2.innerText = 'Libro';
        let th3 = document.createElement('th');
        th3.scope = 'col';
        th3.innerText = 'Data prenotazione';
        
        tr.appendChild(th0);
        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);

        if(isCuratore){
            let th4 = document.createElement('th');
            th4.scope = 'col';
            th4.innerText = 'Elimina';
            tr.appendChild(th4);
        }
        
        thead.appendChild(tr);
      
        let tbody = document.createElement('tbody');
        tbody.id = 'profile-reservation-tab-body';
      
        table.appendChild(thead);
        table.appendChild(tbody);

        tableContainer.appendChild(table);
      
        reservationTab.parentNode.replaceChild(tableContainer, reservationTab);
      
        let updatedReservationTab = document.getElementById('profile-reservation-tab-body');
      
        let i = 0;
        for (let reservation of reservations) {
          let row = document.createElement('tr');
          i++;
      
          let book = await Api.getBookByISBN(reservation.Libro);
          let user = await Api.getUtenteByID(reservation.Utente);
      
          row.innerHTML = createReservationCard(reservation, book, user,i,isCuratore);

          let btn = row.querySelector('.btn');
          if (btn != null) {
            btn.addEventListener('click', async (event) => {
                let profileID = parseInt(btn.getAttribute('profileID'));
                let isbn = btn.getAttribute('isbn');

                await Api.deleteReservation(profileID,isbn);

                let book = await Api.getBookByISBN(isbn);

                book.Disponibilita = true;

                let responseBook = await Api.modifyBook(book);
                if(responseBook['error']) return;

                page('/profile');
            });
        }
      
          updatedReservationTab.appendChild(row);
        }
      }
      
}