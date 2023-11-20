"use strict";

function createUtenteProfilePage(utente) {
    return `
    <div id="profile-page" class="container-fluid">
        <div id="profile-page-body" class="row">
            <div id="profile-info" class="col-md-4 no-padding">
            <div class="card">
            <div class="card-body">
            <h5 class="card-title">I tuoi dati</h5>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">Nome:</span> ${utente.Name}</li>
                <li class="list-group-item">Cognome:</span> ${utente.Surname}</li>
                <li class="list-group-item">Età:</span> ${utente.Age} anni</li>
                <li class="list-group-item">Città:</span> ${utente.City} (${utente.Province})</li>
                <li class="list-group-item">Contatti:</span> ${utente.Contacts}</li>
              </ul>
            </div>
        </div>
            </div>


            <div id="profile-tabs" class="col-md-8 container-fluid">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active form-label" id="profile-reservation-tab" data-bs-toggle="tab" data-bs-target="#profile-reservation-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Le tue prenotazioni</button>
                    </li>
                </ul>
                <div class="tab-content" id="profile-tabs-content">
                    <div class="tab-pane fade show active" id="profile-reservation-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                        <div id="profile-reservation-tab-body">
                    
                        </div>
                    </div>
                </div>
            </div>

        </div>
        </div>
    </div>
    `;
}

function createCuratoreProfilePage() {
    return `
    <div id="profile-page" class="container-fluid">
        <div id="profile-page-body" class="row">
            <div id="profile-tabs" class="col container-fluid">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active form-label" id="profile-reservation-tab" data-bs-toggle="tab" data-bs-target="#profile-reservation-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Tutte le prenotazioni</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link form-label" id="profile-evento-tab" data-bs-toggle="tab" data-bs-target="#profile-evento-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Gestisci eventi</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link form-label" id="profile-book-tab" data-bs-toggle="tab" data-bs-target="#profile-book-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Gestisci libri</button>
                    </li>
                </ul>
                <div class="tab-content" id="profile-tabs-content">
                    <div class="tab-pane fade show active" id="profile-reservation-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                        <div id="profile-reservation-tab-body">
                            
                        </div>
                    </div>
  
                    <div class="tab-pane fade" id="profile-evento-tab-pane" role="tabpanel" aria-labelledby="profile-evento-tab-pane" tabindex="0">
                        <div class="d-flex justify-content-center align-items-center h-100">
                            <div>
                                <h3>Gestisci eventi</h3>
                                <p>Qui puoi aggiungere un evento andando ad inserire:</p>
                                <ul>
                                    <li class="text-start">Titolo dell'evento</li>
                                    <li class="text-start">Data dell'evento</li>
                                    <li class="text-start">Descrizione dell'evento</li>
                                    <li class="text-start">Foto dell'evento</li>
                                </ul>
                                <div class="d-grid gap-2 col-6 mx-auto container-space2">
                                    <button type="button" class="btn btn-primary btn-addevent" data-bs-toggle="modal" data-bs-target="#event-modal">Aggiungi Evento</button>
                                </div>
                                
                            </div>
                        </div>
                    </div>

  
                    <div class="tab-pane fade" id="profile-book-tab-pane" role="tabpanel" aria-labelledby="profile-book-tab-pane" tabindex="0">
                        <div class="d-flex justify-content-center align-items-center h-100">
                            <div>
                                <h3>Gestisci libri</h3>
                                <p>Qui puoi aggiungere un libro andando ad inserire:</p>
                                <ul>
                                    <li class="text-start">ISBN del libro</li>
                                    <li class="text-start">Titolo del libro</li>
                                    <li class="text-start">Autore del libro</li>
                                    <li class="text-start">Editore del libro</li>
                                    <li class="text-start">Descrizione del libro</li>
                                    <li class="text-start">Genere del libro</li>
                                    <li class="text-start">Anno pubblicazione del libro</li>
                                    <li class="text-start">Copertina del libro</li>
                                </ul>
                                <div class="d-grid gap-2 col-6 mx-auto container-space2">
                                    <button type="button" class="btn btn-primary btn-addbook" data-bs-toggle="modal" data-bs-target="#book-modal">Aggiungi Libro</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
  
        </div>
        </div>
    </div>
    `;
  }
  

  function createReservationCard(reservation, book, user, i, isCuratore) {
    let contacts;
    if (user.Contacts === undefined) contacts = reservation.Utente;
    else contacts = user.Contacts;
  
    let reservationCard = `
      <th scope="row">${i}</th>
      <td>${contacts}</td>
      <td>${book.Titolo}</td>
      <td>${reservation.Giorno}</td>
    `;
  
    if (isCuratore) {
      reservationCard += `
        <td>
          <button class="btn btn-danger" profileID=${reservation.Utente} isbn=${reservation.Libro}>
            <img src="media/images/trash3.svg" alt="Trash" width="15" height="15" class="d-inline-block align-text-top">
          </button>
        </td>
      `;
    }
  
    return reservationCard;
  }

  
  
