-- Base de données Banque du Numérique
-- Structure relationnelle pour gestion globale

CREATE DATABASE banque_du_numerique;

USE banque_du_numerique;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user'
);

CREATE TABLE interlocuteurs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom_structure VARCHAR(100) NOT NULL,
  code_postal VARCHAR(10),
  ville VARCHAR(50),
  inter1_nom VARCHAR(100) NOT NULL,
  inter1_email VARCHAR(100),
  inter1_telephone VARCHAR(30),
  inter2_nom VARCHAR(100),
  inter2_email VARCHAR(100),
  inter2_telephone VARCHAR(30),
  date_initiale DATE,
  date_renouvellement DATE,
  date_ajout DATE DEFAULT CURRENT_DATE
);

CREATE TABLE devices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type VARCHAR(20) NOT NULL, -- PC, Smartphone, etc.
  marque VARCHAR(50),
  etat VARCHAR(30),
  interlocuteur_id INTEGER,
  date_ajout DATE DEFAULT CURRENT_DATE,
  FOREIGN KEY (interlocuteur_id) REFERENCES interlocuteurs(id)
);

CREATE TABLE dons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  interlocuteur_id INTEGER NOT NULL,
  nom_structure VARCHAR(100) NOT NULL,
  type_appareil VARCHAR(20) NOT NULL,
  quantite INTEGER NOT NULL,
  date_don DATE NOT NULL,
  description TEXT,
  numero_reference VARCHAR(30) UNIQUE,
  FOREIGN KEY (interlocuteur_id) REFERENCES interlocuteurs(id)
);
