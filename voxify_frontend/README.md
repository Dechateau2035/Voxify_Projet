# Voxify Frontend

Application frontend de gestion de chants de chorale, construite avec Next.js (App Router), React et TypeScript.

## 1) Resume du projet

Ce frontend permet de:

- gerer l'authentification (inscription / connexion),
- consulter une bibliotheque de chants,
- filtrer les chants (recherche, categorie, tag),
- voir les details d'un chant (lyrics + pistes audio),
- ajouter / modifier un chant avec upload de fichiers,
- gerer des favoris,
- utiliser un theme clair/sombre.

Le frontend consomme une API backend (base URL actuelle: `http://localhost:3001`).

## 2) Stack technique

- Next.js `16.2.3` (App Router)
- React `19.2.4`
- TypeScript (mode strict)
- Tailwind CSS v4 + shadcn/ui
- Zustand (state management local)
- Axios (client HTTP)
- Framer Motion (animations UI)

## 3) Structure principale

```txt
app/
  (app)/
    page.tsx                  # Dashboard
    chants/
      page.tsx                # Bibliotheque
      new/page.tsx            # Creation chant
      edit/[id]/page.tsx      # Edition chant
      [slug]/page.tsx         # Detail chant
    favorites/page.tsx        # Favoris
  login/page.tsx              # Connexion
  register/page.tsx           # Inscription
components/
  auth-form.tsx
  chant-card.tsx
  chant-form.tsx
  filter-panel.tsx
  app-navbar.tsx
hooks/
  use-chants.ts
lib/
  api/
    client.ts                 # Axios config
    auth.ts                   # Auth endpoints
    chants.ts                 # Chants endpoints
  normalizers.ts              # Normalisation des reponses API
  types.ts
store/
  auth-store.ts
  favorites-store.ts
```

## 4) Prerequis

- Node.js >= `20.9` (recommandation Next.js 16)
- npm
- Un backend Voxify actif sur `http://localhost:3001`

## 5) Installation en local

Depuis le dossier du projet:

```bash
npm install
```

## 6) Lancer le projet

### Mode developpement

```bash
npm run dev
```

Puis ouvrir:

- `http://localhost:3000`
- ou le port affiche dans le terminal si `3000` est deja occupe.

### Mode production local

```bash
npm run build
npm run start
```

## 7) Scripts disponibles

- `npm run dev`: lance le serveur de dev (Turbopack)
- `npm run build`: build de production
- `npm run start`: demarre l'app en mode production
- `npm run lint`: verification ESLint

Note: il n'y a pas de script `npm test` configure actuellement.

## 8) Configuration backend attendue

Le frontend appelle notamment:

- `POST /auth/login`
- `POST /auth/register`
- `GET /chants`
- `GET /chants/:id`
- `GET /chants/slug/:slug`
- `POST /chants` (multipart/form-data)
- `PATCH /chants/:id` (multipart/form-data)

Le client HTTP est configure avec:

- `baseURL: http://localhost:3001`
- `withCredentials: true`

Si ton backend est sur une autre URL/port, mets a jour `lib/api/client.ts`.

## 9) Tests et validations a effectuer

### A. Verification automatique disponible

```bash
npm run lint
```

### B. Verification build

```bash
npm run build
```

Si un serveur dev tourne deja, stoppe-le avant de builder.

### C. Tests fonctionnels manuels recommandes

1. **Auth**
   - Creer un compte sur `/register`
   - Se connecter sur `/login`
   - Verifier la redirection vers `/`

2. **Dashboard**
   - Verifier l'affichage des sections `Populaires`, `Recents`, `Categories`
   - Verifier le fallback skeleton pendant chargement

3. **Bibliotheque**
   - Rechercher un chant par titre
   - Filtrer par categorie puis par tag
   - Tester `Charger plus`

4. **Detail chant**
   - Ouvrir un chant via `Voir`
   - Verifier lyrics et tags
   - Lancer les pistes audio (principale + voix)

5. **Creation / edition**
   - Ajouter un chant (`/chants/new`) avec image + audio
   - Modifier un chant (`/chants/edit/[id]`)
   - Verifier retour vers la liste

6. **Favoris**
   - Ajouter/retirer un chant en favori depuis une carte
   - Verifier la page `/favorites`

7. **Theme et responsive**
   - Basculer clair/sombre
   - Tester affichage mobile (menu drawer)

## 10) Limitations actuelles

- Pas de tests automatises unitaires/integration/e2e configures.
- `auth-store` et `favorites-store` ne sont pas persistants (etat perdu au refresh).
- L'URL API est hardcodee dans `lib/api/client.ts` (pas encore via variables d'environnement).

## 11) Depannage rapide

### Erreur API / donnees non chargees

- verifier que le backend tourne bien sur `http://localhost:3001`,
- verifier CORS/cookies (car `withCredentials: true`),
- verifier les endpoints disponibles cote backend.

### Port 3000 deja utilise

Next.js prend automatiquement un autre port. Utilise l'URL affichee dans le terminal.

### Erreur `EPERM` pendant `npm run build`

Ca arrive souvent si un process Next.js est deja actif.

1. stoppe le serveur dev en cours,
2. relance `npm run build`.
