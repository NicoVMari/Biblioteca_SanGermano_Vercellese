"use strict";

function createInformationPage(){
    return `<div class="row shadow-row" id="informazioni">
      <h2>Informazioni</h2>
      <div class="row row-cols-1 row-cols-lg-3 g-4 justify-content-center"> 
        <div class="col">
            <h5>Orari di apertura</h5>
            <div class="card">
            <div class="card-body">
              <h5 class="card-title">Orari di apertura</h5>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">Lunedì: <span class="opening-hours">15:00 - 18:00</span></li>
                <li class="list-group-item">Martedì: 16:00 - 18:00</li>
                <li class="list-group-item">Sabato: 15:00 - 17:00</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col">
          <h5>Ci troviamo qua!</h5>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1414.2913223599164!2d8.24957070547574!3d45.35201455905071!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478635e56a3e94a3%3A0xcf96001e8c6a0449!2sBiblioteca%20Comunale!5e0!3m2!1sit!2sit!4v1683614756441!5m2!1sit!2sit" width="600" height="450"></iframe>
        </div>
      </div>
    </div>`
}
