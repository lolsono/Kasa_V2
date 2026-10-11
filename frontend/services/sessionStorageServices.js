const KEY = "kasa_user";
const FAVORITES_KEY = "kasa_favorites";

export function saveUser(user) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function getUser() {
  try {
    const stored = localStorage.getItem(KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem(KEY);
    return null;
  }
}

export function clearUser() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(FAVORITES_KEY); // les favoris appartiennent à l'utilisateur
}

// --- Favoris : on ne garde que les ids des logements ---

export function saveFavoriteIds(ids) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

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

export function clearFavoriteIds() {
  localStorage.removeItem(FAVORITES_KEY);
}
