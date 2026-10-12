/**
 * Types JSDoc partagés. Ce fichier ne contient aucun code : il sert
 * uniquement à décrire la forme des objets pour l'autocomplétion
 * (ex. `@param {import("@/types/typedefs").Logement} logement`).
 */

/**
 * Hôte d'un logement.
 *
 * @typedef {Object} Host
 * @property {number} id
 * @property {string} name
 * @property {string} picture - URL de la photo de l'hôte.
 */

/**
 * Logement tel que renvoyé par l'API.
 *
 * @typedef {Object} Logement
 * @property {string} id - Identifiant du logement (ex. "c67ab8a7").
 * @property {string} slug
 * @property {string} title
 * @property {string} description
 * @property {string} cover - URL de l'image de couverture.
 * @property {string} location
 * @property {number} price_per_night
 * @property {number} rating_avg
 * @property {number} ratings_count
 * @property {Host} host
 */

/**
 * Utilisateur connecté, tel que stocké dans le localStorage (clé `kasa_user`).
 *
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string|null} picture
 * @property {string} role - Par exemple "client".
 */

/**
 * Valeur exposée par `FavoritesContext` (hook `useFavorites`).
 *
 * @typedef {Object} FavoritesContextValue
 * @property {string[]} ids - Ids des logements en favoris.
 * @property {boolean} ready - `true` une fois le premier chargement terminé.
 * @property {(propertyId: string) => boolean} isFavorite
 * @property {(propertyId: string) => Promise<void>} addFavorite
 * @property {(propertyId: string) => Promise<void>} removeFavorite
 */

export {};
