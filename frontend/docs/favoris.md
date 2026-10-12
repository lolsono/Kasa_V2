# Fonctionnalité Favoris

Permet à un utilisateur connecté d'ajouter un logement à ses favoris en cliquant sur le cœur, de le retirer en recliquant, et de retrouver tous ses favoris sur la page **Vos favoris** (`/favoris`), y compris après un rafraîchissement de la page.

## Sommaire

1. [Vue d'ensemble](#1-vue-densemble)
2. [Arborescence](#2-arborescence)
3. [Rôle de chaque fichier](#3-rôle-de-chaque-fichier)
4. [Routes API](#4-routes-api)
5. [Scénarios](#5-scénarios)
6. [Stockage et synchronisation](#6-stockage-et-synchronisation)
7. [Gestion des erreurs](#7-gestion-des-erreurs)
8. [Choix de conception](#8-choix-de-conception)
9. [Documentation du code (JSDoc)](#9-documentation-du-code-jsdoc)
10. [Tests unitaires](#10-tests-unitaires)
11. [Points d'attention](#11-points-dattention)

---

## 1. Vue d'ensemble

Les favoris passent par cinq couches. Chaque couche ne communique qu'avec celle d'à côté :

```
Interface        FavoriteButton, LogementCard, page /favoris
     │
     ▼
Context          FavoritesContext  (observe AuthContext)
     │
     ▼
Services         favoriteServices  +  sessionStorageServices
     │
     ▼
Routes Next      /api/favoris/getFavoris/[id]
                 /api/favoris/addFavoris/[id]
                 /api/favoris/removeFavoris/[id]
     │
     ▼
Backend (API)    reçoit le token en  Authorization: Bearer
```

Le token d'authentification est stocké dans le cookie **httpOnly** `auth_token`. Le navigateur ne peut pas le lire : seules les routes Next le lisent et le transmettent au backend.

## 2. Arborescence

```
app/
├── api/favoris/
│   ├── getFavoris/[id]/route.js      GET
│   ├── addFavoris/[id]/route.js      POST
│   └── removeFavoris/[id]/route.js   DELETE
└── favoris/
    ├── page.jsx
    └── page.module.css
components/LogementCard/
├── LogementCard.jsx
├── FavoriteButton.jsx
└── LogementCard.module.css
context/
├── AuthContext.jsx                   (existant)
└── FavoritesContext.jsx
services/
├── favoriteServices.js
└── sessionStorageServices.js
types/
└── typedefs.js                       (types JSDoc partagés)
__tests__/
├── api/favorisRoutes.test.js
├── app/FavorisPage.test.jsx
├── components/FavoriteButton.test.jsx
├── context/FavoritesContext.test.jsx
└── services/
    ├── favoriteServices.test.js
    └── sessionStorageServices.test.js
```

## 3. Rôle de chaque fichier

| Fichier | Rôle |
| --- | --- |
| `services/sessionStorageServices.js` | Lit et écrit dans le localStorage : l'utilisateur (`kasa_user`) et la liste des ids favoris (`kasa_favorites`). `clearUser` efface aussi les favoris. |
| `services/favoriteServices.js` | `addFavorite(propertyId, userId)`, `getFavorites(userId)` et `removeFavorite(propertyId)`. Appellent uniquement les routes Next et lancent une `Error` avec le message de l'API en cas d'échec. |
| `app/api/favoris/*/route.js` | Vérifient le cookie `auth_token` (sinon 401), appellent le backend avec `Authorization: Bearer`, et renvoient le message d'erreur de l'API avec son code HTTP. |
| `context/FavoritesContext.jsx` | Garde en mémoire la liste des ids favoris et expose `ids`, `ready`, `isFavorite`, `addFavorite`, `removeFavorite`. Observe `useAuth()` pour se recharger à la connexion / déconnexion. |
| `components/LogementCard/FavoriteButton.jsx` | Affiche le cœur (rouge si favori). Un clic ajoute ou retire. Affiche le message d'erreur de l'API dans une bulle. |
| `components/LogementCard/LogementCard.jsx` | Carte d'un logement. Contient le bouton cœur, mais ne connaît pas l'état des favoris. |
| `app/favoris/page.jsx` | Page « Vos favoris ». Charge les logements complets depuis l'API et filtre avec `isFavorite`. |
| `types/typedefs.js` | Types JSDoc partagés (`Logement`, `User`, `FavoritesContextValue`…). |

## 4. Routes API

Toutes les routes lisent le token dans le cookie `auth_token` et renvoient **401** s'il est absent.

| Méthode | URL | `id` | Appelle le backend | Body |
| --- | --- | --- | --- | --- |
| GET | `/api/favoris/getFavoris/{id}` | id de l'utilisateur | `GET /api/users/{id}/favorites` | — |
| POST | `/api/favoris/addFavoris/{id}` | id du logement | `POST /api/properties/{id}/favorites` | `{ user_id, score, comment }` |
| DELETE | `/api/favoris/removeFavoris/{id}` | id du logement | `DELETE /api/properties/{id}/favorites` | — |

> Les URLs du backend sont marquées `TODO` dans les routes : elles sont à confirmer avec l'équipe API.

**Réponses communes :**

| Code | Signification |
| --- | --- |
| 200 / 201 | Succès, corps renvoyé par l'API (`{ success: true }` pour un DELETE sans contenu) |
| 401 | Cookie `auth_token` absent : `{ success: false, message: "Utilisateur non authentifié" }` |
| code de l'API | Erreur du backend : `{ success: false, message: <message de l'API> }` |
| 500 | Erreur interne : `{ success: false, message: "Erreur interne du serveur" }` |

## 5. Scénarios

### Chargement de l'application

1. `AuthProvider` relit l'utilisateur depuis le localStorage.
2. Quand son `loading` passe à `false`, `FavoritesProvider` lit la copie locale des ids (les cœurs sont rouges immédiatement).
3. Il appelle ensuite l'API et **remplace** la liste par la réponse.
4. Il passe `ready` à `true`.

### Clic pour ajouter

1. `FavoriteButton` appelle `addFavorite(id)` du Context.
2. Le Context ajoute l'id à la liste et au localStorage **tout de suite** (mise à jour optimiste) : le cœur devient rouge.
3. Il envoie le POST.
4. Si l'API refuse, l'id est retiré et l'erreur remonte au bouton, qui affiche le message.

### Clic pour retirer

Même principe : l'id est retiré immédiatement, le DELETE part, et l'id est remis si l'API refuse.

### Rafraîchissement de la page

Le Context est vidé, mais la copie locale le remplit tout de suite, puis l'API corrige. Les cœurs restent donc rouges après un refresh.

### Connexion / déconnexion

Le Context observe `user.id` de `AuthContext` :

- **connexion** : les favoris du compte sont chargés ;
- **déconnexion** : la liste en mémoire et le localStorage sont vidés, les cœurs redeviennent gris.

Aucun appel manuel n'est nécessaire dans `login` ni dans `logout`.

### Page « Vos favoris »

1. La page appelle `getFavorites(user.id)` pour récupérer les logements complets (titre, photo, prix).
2. Elle n'affiche que ceux pour lesquels `isFavorite` est vrai.
3. Retirer un cœur sur cette page fait donc disparaître la carte sans rechargement.
4. Elle attend `ready` pour ne pas afficher « aucun favori » pendant le chargement.

États gérés : chargement, non connecté, erreur (avec le message de l'API), liste vide.

## 6. Stockage et synchronisation

| Clé localStorage | Contenu | Effacée par |
| --- | --- | --- |
| `kasa_user` | L'utilisateur connecté | `clearUser()` |
| `kasa_favorites` | Tableau des **ids** des logements favoris | `clearUser()`, `clearFavoriteIds()`, déconnexion |

- Seuls les **ids** sont stockés, pas les logements complets.
- **L'API est la référence.** La copie locale n'est qu'un cache d'affichage : elle est écrasée par la réponse de l'API à chaque chargement.
- Le Context et le localStorage sont toujours mis à jour **ensemble** (fonction `updateIds`).

## 7. Gestion des erreurs

Le message d'erreur est toujours celui **renvoyé par l'API**, transmis tel quel à travers toutes les couches :

```
API  →  route Next  →  service  →  Context  →  FavoriteButton
        (message +     (Error)     (annule     (bulle role="alert",
         code HTTP)                 l'action)    disparaît après 4 s)
```

- Si le message de l'API est absent, chaque couche utilise un message par défaut.
- Un DELETE sans contenu (204) est accepté.
- En cas d'échec d'un ajout ou d'un retrait, l'état du cœur revient en arrière.
- Sur la page `/favoris`, le message de l'API remplace la liste.

## 8. Choix de conception

- **API = référence, localStorage = cache.** L'API contient la vérité (un favori peut être ajouté depuis un autre appareil), le localStorage sert à un affichage immédiat.
- **Seulement des ids.** C'est léger, et les données complètes d'un logement restent côté API.
- **Mise à jour optimiste avec annulation.** L'interface réagit tout de suite et revient en arrière si l'API refuse.
- **Token côté serveur uniquement.** Les composants et les services ne le manipulent jamais.
- **Context branché sur l'authentification.** Pas d'appels manuels à la connexion / déconnexion, ce qui évite les oublis.
- **Services « bêtes ».** Ils reçoivent leurs ids en paramètre et n'accèdent ni au localStorage ni au Context, ce qui les rend simples à tester.

## 9. Documentation du code (JSDoc)

Toutes les fonctions et tous les composants de la fonctionnalité sont documentés avec JSDoc (`@param`, `@returns`, `@throws`). Les types partagés sont dans `types/typedefs.js` et s'utilisent ainsi :

```js
/**
 * @param {import("@/types/typedefs").Logement} logement
 */
```

Ces commentaires alimentent l'autocomplétion et l'aide au survol de VS Code.

## 10. Tests unitaires

**Outils :** Jest (via `next/jest`), React Testing Library et `@testing-library/jest-dom`.

### Installation

```bash
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
```

Ajouter dans `package.json` :

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch"
}
```

Fichiers de configuration à la racine : `jest.config.mjs` et `jest.setup.js`.

### Lancer les tests

```bash
npm test                      # tous les tests
npm test -- favoris           # ceux dont le nom contient « favoris »
npm test -- --coverage        # avec le taux de couverture
```

### Couverture des tests

| Fichier de test | Ce qui est vérifié |
| --- | --- |
| `services/sessionStorageServices.test.js` | Lecture / écriture des ids, JSON invalide, valeur qui n'est pas un tableau, `clearUser` qui efface aussi les favoris |
| `services/favoriteServices.test.js` | URL et body de chaque appel, extraction de `property`, message d'erreur de l'API, message par défaut, réponse sans contenu |
| `context/FavoritesContext.test.jsx` | Chargement depuis l'API, copie locale, utilisateur absent, attente de l'auth, ajout / retrait optimistes, annulation en cas d'erreur, erreur hors Provider |
| `components/FavoriteButton.test.jsx` | `aria-pressed` et libellés, ajout / retrait au clic, clics ignorés pendant une requête, message d'erreur de l'API, disparition après 4 s |
| `app/FavorisPage.test.jsx` | Titre, liste, filtrage par le Context, liste vide, non connecté, erreur de l'API, états de chargement |
| `api/favorisRoutes.test.js` | 401 sans cookie, token en Bearer, body transmis, erreur et code de l'API, réponse 204, erreur 500 |

## 11. Points d'attention

- **Ordre des Provider** dans `app/layout.jsx` : `FavoritesProvider` doit être **à l'intérieur** de `AuthProvider`.
- **URLs du backend** : à confirmer dans les trois routes (`TODO`).
- **Forme de la réponse du GET** : `getFavorites` accepte une liste de logements ou des objets avec une clé `property`. Les ids renvoyés doivent correspondre à ceux de la liste des logements, sinon les cœurs ne s'allument pas.
- **Nom du cookie** : `auth_token`. À adapter dans les routes s'il change.
- **Alias `@/`** : dans `jest.config.mjs`, remplacer `<rootDir>/$1` par `<rootDir>/src/$1` si le projet utilise un dossier `src/`.
