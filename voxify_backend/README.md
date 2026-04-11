# Voxify Backend

API REST NestJS pour gerer les chants (creation, consultation, mise a jour, suppression), avec upload de medias vers Cloudinary et stockage des metadonnees dans MongoDB.

## Resume du projet

Le backend expose:

- un module `chants` pour le CRUD complet des chants
- un module `upload` pour uploader un fichier unique
- une integration Cloudinary pour stocker image/audio
- une documentation Swagger disponible en local
- des tests Jest (unitaires + e2e) et une verification lint

Fonctionnalites metier principales:

- creation de chant avec metadonnees (`title`, `category`, `lyrics`, `tags`, `isPublished`)
- support de medias associes (`coverImage`, `audioUrl`, `soprano`, `alto`, `tenor`, `bass`)
- generation automatique d'un `slug` a partir du titre
- filtres sur la liste des chants (`category`, `tag`, `isPublished`)
- suppression propre des fichiers Cloudinary lors d'une suppression de chant

## Stack technique

- Node.js + TypeScript
- NestJS 11
- MongoDB + Mongoose
- Cloudinary
- Swagger (`/api`)
- Jest + Supertest
- ESLint + Prettier

## Arborescence utile

```text
src/
  app.module.ts
  main.ts
  chants/
    chants.controller.ts
    chants.service.ts
    entities/chant.entity.ts
    dto/
  cloudinary/
  upload/
  Test API/
    chants.api.http
    uploads.api.http
test/
  app.e2e-spec.ts
```

## Installation en local

### 1) Prerequis

- Node.js 20+ recommande
- npm
- MongoDB (local ou distant)
- Un compte Cloudinary (pour les endpoints d'upload)

### 2) Installer les dependances

```bash
npm install
```

### 3) Configurer les variables d'environnement

Creer un fichier `.env` a la racine du projet avec au minimum:

```env
PORT=3001
MONGODB_CONNECT=mongodb://localhost:27017/voxify

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Notes:

- `PORT` et `MONGODB_CONNECT` sont obligatoires au demarrage (validation Joi).
- Si MongoDB n'est pas actif, l'application ne pourra pas se connecter.
- Les routes d'upload (`/upload`, upload medias dans `/chants`) necessitent les cles Cloudinary.

### 4) Demarrer MongoDB localement (optionnel)

Si tu n'as pas MongoDB installe en service, tu peux utiliser Docker:

```bash
docker run --name voxify-mongo -p 27017:27017 -d mongo:7
```

## Lancer le projet

### Mode developpement

```bash
npm run start:dev
```

### Mode standard

```bash
npm run start
```

### Build + mode production

```bash
npm run build
npm run start:prod
```

Une fois lance, endpoints utiles:

- API: `http://localhost:<PORT>`
- Swagger UI: `http://localhost:<PORT>/api`
- Swagger JSON: `http://localhost:<PORT>/swagger/json`

Important:

- Le CORS est configure sur `http://localhost:3000` dans `src/main.ts`.
- Si ton frontend tourne sur un autre port/domaine, adapte cette valeur.

## Endpoints principaux

### Racine

- `GET /` -> verifie que l'API repond (`Hello World!`)

### Upload simple

- `POST /upload` (multipart, champ `file`)
- Retourne: `url`, `public_id`

### Chants

- `POST /chants` (JSON ou multipart)
- `GET /chants`
- `GET /chants?category=...&tag=...&isPublished=true|false`
- `GET /chants/:id`
- `GET /chants/slug/:slug`
- `PATCH /chants/:id`
- `DELETE /chants/:id`

## Tests que tu peux effectuer

### 1) Tests automatiques (npm scripts)

```bash
# Lint
npm run lint

# Tests unitaires
npm run test

# Coverage
npm run test:cov

# End-to-end
npm run test:e2e
```

Etat actuel verifie le 11 avril 2026:

- `npm run build`: OK
- `npm run lint`: KO (plusieurs erreurs TypeScript/ESLint)
- `npm run test`: KO
- `npm run test:cov`: KO (la commande genere un rapport, mais la suite echoue)
- `npm run test:e2e`: KO

Principales causes des echecs actuels:

- `src/chants/chants.controller.spec.ts` importe `./chants.controller.copy1` (fichier introuvable)
- `src/chants/chants.service.spec.ts` ne mock pas la dependance `ChantModel`
- les tests e2e echouent sur la resolution d'import `src/cloudinary/cloudinary.service`

### 2) Tests manuels de l'API

Tu peux tester l'API de trois facons:

- Swagger: ouvre `http://localhost:<PORT>/api`
- REST Client VS Code: fichiers dans `src/Test API/`
- cURL/Postman/Insomnia

Exemples cURL:

```bash
# Ping API
curl http://localhost:3001/

# Creer un chant simple
curl -X POST http://localhost:3001/chants \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Amazing Grace\",\"category\":\"adoration\",\"tags\":[\"lent\"],\"isPublished\":true}"

# Upload de fichier simple
curl -X POST http://localhost:3001/upload \
  -F "file=@src/Test API/yess.jpg"
```

Pour les tests multipart complets (cover + audio + voix), utilise:

- `src/Test API/chants.api.http`
- `src/Test API/uploads.api.http`

Pense a adapter `@baseUrl` dans ces fichiers selon ton `PORT`.

## Depannage rapide

- Erreur de connexion MongoDB: verifier que MongoDB tourne et que `MONGODB_CONNECT` est correct.
- Erreur upload Cloudinary: verifier `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- Erreur CORS frontend: mettre a jour `origin` dans `src/main.ts`.
- Erreurs tests unitaires/e2e: corriger les specs mentionnees ci-dessus avant integration CI.
