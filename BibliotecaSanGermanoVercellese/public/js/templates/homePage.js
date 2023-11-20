"use strict";

function createHomePage(){
    return `<div class="row shadow-row" id="home">
      <h2><em>Biblioteca G. Deabate San Germano Vercellese</em></h2>
      <div class="row row-cols-1 row-cols-lg-2 g-4 justify-content-center">
        <div class="col">
          <div class="container-space">
            <h3>Prenota e leggi la nostra collezione di libri</h3>
            <h5><em>Un centro di conoscenza</em></h5>
          </div>
        </div>
        <div class="col">
          <div id="carouselHome" class="carousel slide">
            <div class="carousel-indicators">
              <button type="button" data-bs-target="#carouselHome" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselHome" data-bs-slide-to="1" aria-label="Slide 2"></button>
            </div>
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img src="media/images/c2.jpg" class="d-block w-100" alt="...">
              </div>
              <div class="carousel-item">
                <img src="media/images/c1.jpg" class="d-block w-100" alt="...">
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselHome" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselHome" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>`
}