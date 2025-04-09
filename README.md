# MoovieBooker

## Aperçu

MoovieBooker est une API complète conçue pour gérer les réservations de films et les interactions des utilisateurs. Cette API permet aux utilisateurs de s'inscrire, de se connecter, de rechercher des films et de gérer leurs réservations. Elle offre une expérience fluide pour les amateurs de cinéma afin de réserver leurs films préférés sans effort.

## Fonctionnalités

- **Gestion des Utilisateurs** : Inscription et connexion sécurisées des utilisateurs.
- **Recherche de Films** : Recherche et filtrage des films selon divers critères.
- **Gestion des Réservations** : Création et gestion des réservations de films.

## Mise en Route

Pour commencer avec l'API MoovieBooker, suivez ces étapes :

1. **Cloner le Dépôt** : Clonez le dépôt sur votre machine locale.
   ```bash
   git clone <url-du-dépôt>
   ```
2. **Installer les Dépendances** : Accédez au répertoire du projet et installez les dépendances nécessaires.
   ```bash
   npm install
   ```
3. **Lancer l'Application** : Démarrez l'application.
   ```bash
   npm start
   ```
## Points de Terminaison de l'API

Tous les points de terminaison sont documentés dans le répertoire /docs du serveur API via Swagger.

### 1. Gestion des Utilisateurs

#### Inscription
- **Endpoint** : `POST /auth/register`
- **Description** : Inscrire un nouvel utilisateur.
- **Corps de la Requête** :
  ```json
  {
    "username": "string",
    "password": "string"
  }
- **Réponse** :
    - **201 Created** : Utilisateur inscrit avec succès.

#### Connexion
- **Endpoint** : `POST /auth/login`
- **Description** : Connecter un utilisateur existant.
- **Corps de la Requête** :
  ```json
  {
    "username": "string",
    "password": "string"
  }
- **Réponse** :
    - **200 OK** : Utilisateur connecté avec succès.

#### Obtenir le Profil Utilisateur
- **Endpoint** : `GET /auth/me`
- **Description** : Récupérer les informations du profil de l'utilisateur connecté.
- **Réponse** :
    - **200 OK** : Détails du profil utilisateur.

### 2. Recherche de Films

#### Rechercher des Films
- **Endpoint** : `GET /movie/movies`
- **Description** : Rechercher ou filtrer des films selon divers critères.
- **Paramètres de Requête** :
    - `title` : Filtrer les films par titre.
    - `genre` : Filtrer les films par genre.
- **Réponse** :
    - **200 OK** : Liste des films correspondant aux critères.

#### Lister les Genres
- **Endpoint** : `GET /movie/genres`
- **Description** : Lister tous les genres de films disponibles.
- **Réponse** :
    - **200 OK** : Liste des genres.

### 3. Gestion des Réservations

#### Créer une Réservation
- **Endpoint** : `POST /reservation`
- **Description** : Créer une nouvelle réservation pour un film.
- **Corps de la Requête** :
  ```json
  {
    "film_id": "string",
    "reservationDate": "string"
  }
- **Réponse** :
    - **201 Created** : Réservation créée avec succès.

#### Obtenir les Réservations de l'Utilisateur
- **Endpoint** : `GET /reservation`
- **Description** : Récupérer toutes les réservations de l'utilisateur connecté.
- **Réponse** :
    - **200 OK** : Liste des réservations de l'utilisateur.

#### Supprimer une Réservation
- **Endpoint** : `DELETE /reservation/{id}`
- **Description** : Supprimer une réservation par son ID.
- **Réponse** :
    - **200 OK** : Réservation supprimée avec succès.
