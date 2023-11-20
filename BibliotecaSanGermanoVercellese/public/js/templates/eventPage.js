"use strict";

function createEventPage(){
  return `<div class="row shadow-row" id="eventi">
  <h2>Eventi</h2>
  <div id="event-list" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 justify-content-center">

  </div>
</div>`
}

function createEventCard(event){
  return `<div class="card shadow-row">
  ${event.Filepath != null ? '<img src="'+ event.Filepath +'" class="card-img-top" alt="...">' : ''}
    <div class="card-body">
      <h5 class="card-title">${event.Titolo}</h5>
      <p class="card-text p-card">${event.Descrizione}</p>
    </div>
    <div class="card-footer">
      <small class="text-body-secondary">${event.Giorno}</small>
    </div>
  </div>`
}
