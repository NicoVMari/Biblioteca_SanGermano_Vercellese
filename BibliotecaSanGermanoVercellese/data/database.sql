
-- Credenziali Utente

CREATE TABLE "UserCredentials" (
	"ProfileID"	INTEGER NOT NULL UNIQUE,
	"User"	INTEGER NOT NULL UNIQUE,
	"Password"	INTEGER NOT NULL,
	PRIMARY KEY("ProfileID" AUTOINCREMENT)
);

-- Credenziali Curatore

CREATE TABLE "CuratoreCredentials" (
	"ProfileID"	INTEGER NOT NULL UNIQUE,
	"User"	TEXT NOT NULL UNIQUE,
	"Password"	INTEGER NOT NULL,
	PRIMARY KEY("ProfileID" AUTOINCREMENT)
);

-- Dati Utente

CREATE TABLE "Utente" (
	"ProfileID"	INTEGER NOT NULL UNIQUE,
	"Name"	TEXT NOT NULL,
	"Surname"	TEXT NOT NULL,
	"Age"	INTEGER NOT NULL,
	"City"	TEXT NOT NULL,
	"Province"	TEXT NOT NULL,
	"Contacts"	TEXT NOT NULL,
	PRIMARY KEY("ProfileID" AUTOINCREMENT),
	FOREIGN KEY (ProfileID) REFERENCES UserCredentials(ProfileID)
);

-- Dati Evento

CREATE TABLE "Event"(
    "ID" INTEGER NOT NULL UNIQUE,
    "Titolo" TEXT NOT NULL,
    "Giorno" TEXT NOT NULL,
    "Descrizione" TEXT NOT NULL,
    "Filepath" TEXT NOT NULL UNIQUE,
    PRIMARY KEY("ID" AUTOINCREMENT)
);

-- Dati Libro

CREATE TABLE "Book" (
    "ISBN" TEXT NOT NULL UNIQUE,
    "Titolo" TEXT NOT NULL,
    "Autore" TEXT NOT NULL,
    "Editore" TEXT NOT NULL,
    "Disponibilita" BOOLEAN DEFAULT TRUE,
    "Genere" TEXT NOT NULL,
    "Anno_pubblicazione" TEXT NOT NULL,
    "Descrizione" TEXT,
    "Filepath" TEXT NOT NULL UNIQUE,
	PRIMARY KEY("ISBN")
);

-- Dati Prenotazione

CREATE TABLE "Reservation" (
    "Utente" INTEGER NOT NULL,
    "Libro" TEXT NOT NULL,
    "Giorno" TEXT NOT NULL,
    FOREIGN KEY("Utente") REFERENCES "Utente"("ProfileID"),
    FOREIGN KEY("Libro") REFERENCES "Book"("ISBN")
);
