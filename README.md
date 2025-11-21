# Mini Blog Collaboratif – MEAN Stack

Projet fullstack composé de deux applications :

- backend/ → API REST (Node.js, Express, MongoDB/Mongoose, Socket.io)
- frontend/ → SPA Angular 17 (standalone) + Tailwind CSS

##  Fonctionnalités
- Authentification JWT (login / register)
- Gestion des rôles : ADMIN, EDITOR, WRITER, READER
- CRUD articles avec upload d’image
- Commentaires avec notifications temps réel (Socket.io)
- Gestion des utilisateurs (admin : changement de rôle)
- Page profil utilisateur

---

#  Backend

##  Structure
backend/
 ├── src/
 │    ├── modules/ (auth, users, articles, comments, notifications)
 │    ├── middlewares/
 │    ├── scripts/ (seed-admin.js)
 │    ├── app.js
 │    └── server.js
 └── tests/ (permissions)

##  Installation
cd backend
npm install

## Seeder (admin par défaut)
npm run seed:admin
email : admin@test.com
mot de passe : Admin123

##  Tests
npm test

##  Lancer le backend
npm run dev

---

#  Frontend

## Structure
frontend/
 ├── src/app/
 │     ├── core/
 │     ├── features/ (auth, articles, admin, profile)
 │     └── shared/
 ├── angular.json
 └── package.json

##  Installation
cd frontend
npm install

### Vérifiez la configuration backend :
Avant de lancer le frontend, vérifiez le fichier :
`src/environments/environment.ts`

Les URL doivent pointer vers votre backend (ex : http://localhost:4000).

##  Démarrer le frontend
npm start

---

#  Résumé
Backend + Frontend MEAN, avec auth, rôles, articles avec image, commentaires, notifications, profil et admin.
