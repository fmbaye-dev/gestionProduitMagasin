```markdown
# API REST pour la Gestion des Produits d'un Magasin

Une API REST développée avec Node.js, Express et MySQL pour gérer les produits d'un petit magasin.

## Fonctionnalités

- Ajouter de nouveaux produits
- Consulter tous les produits
- Obtenir un produit spécifique
- Recherche multicritère des produits
- Modifier les informations d'un produit
- Supprimer des produits (avec règles métier)

## Technologies Utilisées

- **Node.js** - Environnement d'exécution
- **Express.js** - Framework web
- **MySQL** - Base de données
- **MySQL2** - Driver MySQL pour Node.js

## Installation

### Prérequis

- Node.js (v14 ou supérieur)
- MySQL Server

### Étapes d'installation

```

1. Installer les dépendances
   ```bash
   npm install
   ```
2. Configuration de la base de données
   Créer la base de données magasin_db et exécuter le script SQL suivant :
   ```sql
   create database if not exists magasin_db;
   use magasin_db;
   
   create table if not exists produits (
       id int primary key auto_increment,
       nom varchar(100),
       prix int,
       quantite int ,
       categorie varchar(50),
       date_ajout datetime
   );
   
   INSERT INTO produits (nom, prix, quantite, categorie) VALUES
   ('Cahier 100 pages', 500.00, 50, 'Fourniture'),
   ('Stylo bleu', 150.00, 100, 'Fourniture'),
   ('Sac à dos', 15000.00, 20, 'Accessoire'),
   ('Règle 30cm', 200.00, 0, 'Fourniture'),
   ('Calculatrice scientifique', 8000.00, 15, 'Électronique'),
   ('Crayon HB', 100.00, 200, 'Fourniture');
   ```
3. Démarrer le serveur
   Mode développement (avec nodemon) :
   ```bash
   npm run dev
   ```
   Mode production :
   ```bash
   npm start
   ```
   Le serveur démarre sur le port 3000.

API Endpoints

1. Ajouter un Produit

POST /produits

Corps de la requête :

```json
{
  "nom": "Gomme blanche",
  "prix": 200,
  "quantite": 30,
  "categorie": "Fourniture"
}
```

Validations :

- Tous les champs sont obligatoires
- Prix > 0
- Quantité ≥ 0

2. Lister tous les Produits

- GET /produits

3. Obtenir un Produit Spécifique

- GET /produits/:id

  - Exemple : GET /produits/1

4. Recherche Multicritère

- GET /produits/recherche

  - Paramètres de requête (optionnels) :
  
    - categorie : Filtrer par catégorie exacte
    - prix_min : Prix minimum (inclus)
    - prix_max : Prix maximum (inclus)

  - Exemples :

    - GET /produits/recherche?categorie=Fourniture
    - GET /produits/recherche?prix_min=100&prix_max=1000
    - GET /produits/recherche?en_stock=true&categorie=Fourniture

5. Modifier un Produit

- PUT /produits/:id

  - Corps de la requête :

    ```json
    {
      "nom": "Nouveau nom",
      "prix": 250,
      "quantite": 40,
      "categorie": "Nouvelle catégorie"
    }
    ```

6. Supprimer un Produit

- DELETE /produits/:id

  - Règle métier : Un produit ne peut être supprimé que si sa quantité est égale à 0.

  - Structure du Projet

    ```
    magasin-api/
    ├── server.js          # Fichier principal de l'application
    ├── magasin.sl         # Fichier script création de la BD et insertion des données
    ├── package.json       # Configuration npm et dépendances
    └── README.md          # Documentation du projet
    ```

- Structure de la Table Produits

  - Champ Type Description
  - id int PK Identifiant unique auto-incrémenté
  - nom varchar(100) Nom du produit 
  - prix int Prix en FCFA 
  - quantite int Quantité en stock 
  - categorie varchar (50) Catégorie du produit
  - date_ajout datetime

- Utilisation

1. Assurez-vous que MySQL est en cours d'exécution
2. Configurez vos identifiants de base de données dans server.js si nécessaire
3. Démarrez le serveur avec npm run dev
4. Utilisez un client HTTP (Postman, curl, etc.) pour tester les endpoints

- Données de Test

  - L'API inclut des données de test :

    - Cahier 100 pages (500 FCFA, 50 unités)
    - Stylo bleu (150 FCFA, 100 unités)
    - Sac à dos (15000 FCFA, 20 unités)
    - Règle 30cm (200 FCFA, 0 unité)
    - Calculatrice scientifique (8000 FCFA, 15 unités)
    - Crayon HB (100 FCFA, 200 unités)

- Scripts Disponibles

  - npm run dev : Lance le serveur en mode développement avec nodemon
  - npm start : Lance le serveur en mode production

- Exemples de Requêtes

  - Ajouter un produit
  
  ```bash
  curl -X POST http://localhost:3000/produits \
    -H "Content-Type: application/json" \
    -d '{"nom":"Gomme","prix":150,"quantite":25,"categorie":"Fourniture"}'
  ```
  
  - Rechercher des produits
  
  ```bash
  curl "http://localhost:3000/produits/recherche?categorie=Fourniture"
  ```

Notes

- Tous les prix sont en FCFA
- La suppression d'un produit n'est autorisée que si la quantité est à 0
- Les recherches multicritères peuvent être combinées librement

## Auteur
- Fatou Gaye Mbaye
- Developpement Backend
