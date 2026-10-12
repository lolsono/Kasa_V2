/** Clé du localStorage contenant l'utilisateur connecté. */
const KEY = "kasa_user";

/** Clé du localStorage contenant la liste des ids de logements favoris. */
const FAVORITES_KEY = "kasa_favorites";

/**
 * Sauvegarde l'utilisateur connecté dans le localStorage.
 *
 * @param {import("@/types/typedefs").User} user
 * @returns {void}
 */
export function saveUser(user) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

/**
 * Relit l'utilisateur sauvegardé.
 * Si la valeur stockée est illisible, elle est supprimée.
 *
 * @returns {import("@/types/typedefs").User|null} L'utilisateur, ou `null`.
 */
export function getUser() {
  try {
    const stored = localStorage.getItem(KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem(KEY);
    return null;
  }
}

/**
 * Supprime l'utilisateur ET ses favoris du localStorage
 * (les favoris appartiennent à l'utilisateur).
 *
 * @returns {void}
 */
export function clearUser() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(FAVORITES_KEY);
}

/**
 * Sauvegarde la liste des ids de logements favoris.
 * Seuls les ids sont stockés, pas les logements complets.
 *
 * @param {string[]} ids
 * @returns {void}
 */
export function saveFavoriteIds(ids) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

/**
 * Relit la liste des ids de logements favoris.
 * Renvoie un tableau vide si rien n'est stocké, si le JSON est invalide
 * ou si la valeur stockée n'est pas un tableau.
 *
 * @returns {string[]}
 */
export function getFavoriteIds() {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    const ids = stored ? JSON.parse(stored) : [];
    return Array.isArray(ids) ? ids : [];
  } catch {
    localStorage.removeItem(FAVORITES_KEY);
    return [];
  }
}

/**
 * Supprime la liste des favoris du localStorage.
 *
 * @returns {void}
 */
export function clearFavoriteIds() {
  localStorage.removeItem(FAVORITES_KEY);
}
