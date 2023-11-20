"use strict";

function createLoginButton() {
    return `<button id="login-btn" type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#login-modal">Accedi</button>`;
}

function createProfileAndLogoutButtons() {
    return `
    <div class="btn-group">
        <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
            <img src="media/images/person-circle.svg" alt="User" width="40" height="31" class="d-inline-block align-text-top">
        </button>
        <ul class="dropdown-menu dropdown-menu-lg-end">
            <li><a id="view-profile" class="dropdown-item">Il mio account</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a id="logout" class="dropdown-item">Esci</a></li>
        </ul>
    </div>`;
}


