"use strict"

function createReservationPage(){
    return `<div class="row shadow-row" id="prenotazioni">
              <div class="row">
                <div class="col">

                  <h2>Ricerca e prenota libro</h2>

                  <form id="book-page-filters" name="book-page-filters">
                  <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    <div class="col">
                      <label for="titolo-filter" class="form-label">Titolo</label>
                      <input type="text" class="form-control" id="titolo-filter" placeholder="Inserisci il titolo" aria-label="Inserisci il titolo">
                    </div>
                    <div class="col">
                      <label for="autore-filter" class="form-label">Autore</label>
                      <input type="text" class="form-control" id="autore-filter" placeholder="Inserisci l'autore" aria-label="Inserisci l'autore">
                    </div>
                    <div class="col">
                      <label for="editore-filter" class="form-label">Editore</label>
                      <input type="text" class="form-control" id="editore-filter" placeholder="Inserisci l'editore" aria-label="Inserisci l'editore">
                    </div>
                    <div class="col">
                      <label for="genere-filter" class="form-label">Genere</label>
                      <select id="genere-filter" class="form-select" aria-label="Seleziona il genere">
                        <option selected></option>
                        <option value="Romanzo">Romanzo</option>
                        <option value="Giallo">Giallo</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Storia">Storia</option>
                        <option value="Biografia">Biografia</option>
                        <option value="Disopia">Disopia</option>
                        <option value="Thriller">Thriller</option>
                      </select>
                    </div>
                    <div class="col">
                      <label for="isbn-filter" class="form-label">ISBN</label>
                      <input type="text" class="form-control" id="isbn-filter" placeholder="Inserisci l'ISBN" aria-label="Inserisci l'ISBN">
                    </div>
                    <div class="col">
                      <label for="anno_pubblicazione-filter" class="form-label">Anno pubblicazione</label>
                      <input type="text" min="1900" max="2023" class="form-control" id="anno_pubblicazione-filter">
                    </div>
                  </div>
                  <div class="row">
                    <div class="d-grid gap-2 col-6 mx-auto">
                      <button class="btn btn-primary" type="submit">Cerca</button>
                    </div>
                  </div>
                  </form>
                </div>
              </div>

        <div class="row">
          <div class="col-md-12">
            <div id="book-list">
                
              <div id="carousel-book" class="carousel slide" data-ride="carousel" data-interval="0">

                <div class="carousel-indicators" id="carousel-indicators">
        
                </div>

                <div class="carousel-inner" id="carousel-inner">

                </div>

                <button class="carousel-control-prev" type="button" data-bs-target="#carousel-book" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carousel-book" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Next</span>
                </button>

              </div>

              </div>
            </div>
          </div>
        </div>`
}

function createCarouselItem(book, loggedIn) {
  return `<div class="thumb-wrapper">
            <div class="img-box">
              <img src="${book.Filepath}" class="img-fluid" alt="${book.Titolo}">
            </div>
            <div class="thumb-content">
              <h4>${book.Titolo}</h4>
              <button type="button" class="btn btn-primary btn-dettagli" data-bs-toggle="modal" data-bs-target="#dettagli-modal" data-book='${JSON.stringify(book)}'>Dettagli</button>
              ${loggedIn ? `<button type="button" class="btn btn-primary btn-prenota" data-bs-toggle="modal" data-bs-target="#reservation-modal" data-book='${JSON.stringify(book)}'>Prenota</button>` : `<button type="button" class="btn btn-primary btn-prenota" data-bs-toggle="modal" data-bs-target="#login-modal">Prenota</button>`}
            </div>
          </div>`;
}

function modalDettagliLibro(book){
    return `<div class="modal-header">
                <h5>${book.Titolo}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p><b>Titolo</b>: ${book.Titolo}</p>
                <p><b>Autore</b>: ${book.Autore}</p>
                <p><b>Editore</b>: ${book.Editore}</p>
                <p><b>Anno pubblicazione</b>: ${book.Anno_pubblicazione}</p>
                <p><b>ISBN</b>:  ${book.ISBN}</p>
                <p><b>Descrizione</b>:  ${book.Descrizione}</p>
            </div>`
}

function modalPrenotaLibro(book) {
  if (!book.Disponibilita) {
    return `<div class="modal-header">
              <h5>Prenotazione!</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
              <p>Non puoi prenotare il libro <b>${book.Titolo}</b> perché non è disponibile.</p>
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Chiudi</button>
          </div>`;
  }
  
  return `<div class="modal-header">
              <h5>Prenotazione!</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
              <p>Conferma prenotazione del libro <b>${book.Titolo}</b> scritto da <b>${book.Autore}</b>?</p>
          </div>
          <div class="modal-footer">
              <button type="submit" class="btn btn-primary btn-conferma" id="btn-conferma" book-isbn="${book.ISBN}">Conferma</button>
          </div>`;
}

function showBookDetails(book) {
  const dettagliModal = document.getElementById('dettagli-dinamic');
  dettagliModal.innerHTML = modalDettagliLibro(book);
}

function showBookPrenota(book) {
  const prenotaModal = document.getElementById('reservation-form');
  prenotaModal.innerHTML = modalPrenotaLibro(book);
}
