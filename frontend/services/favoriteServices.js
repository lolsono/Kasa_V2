/**
 * Services des favoris.
 *
 * Ces fonctions appellent uniquement les routes Next (`/api/favoris/...`),
 * jamais le backend directement. Les ids nécessaires sont passés en paramètre.
 * En cas d'erreur, elles lancent une `Error` dont le message est celui
 * renvoyé par l'API.
 *
 * @module services/favoriteServices
 */

/**
 * Ajoute un logement aux favoris (POST).
 *
 * @param {string} propertyId - Id du logement à ajouter.
 * @param {number} userId - Id de l'utilisateur connecté.
 * @returns {Promise<Object>} Réponse de l'API.
 * @throws {Error} Avec le message de l'API si la requête échoue.
 */
export async function addFavorite(propertyId, userId) {
  const response = await fetch(
    `/api/favoris/addFavoris/${encodeURIComponent(propertyId)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        score: 5,
        comment: "",
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors de l'ajout aux favoris");
  }

  return data;
}

/**
 * Récupère les logements favoris d'un utilisateur (GET).
 * Accepte une liste de logements, ou des objets contenant une clé `property`.
 *
 * @param {number} userId - Id de l'utilisateur connecté.
 * @returns {Promise<import("@/types/typedefs").Logement[]>}
 * @throws {Error} Avec le message de l'API si la requête échoue.
 */
export async function getFavorites(userId) {
  const response = await fetch(
    `/api/favoris/getFavoris/${encodeURIComponent(userId)}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors de la récupération des favoris");
  }

  // Accepte soit une liste de logements, soit { ..., property: {logement} }
  return data.map((item) => item.property ?? item);
}

/**
 * Retire un logement des favoris (DELETE).
 * Une réponse sans contenu (204) est acceptée.
 *
 * @param {string} propertyId - Id du logement à retirer.
 * @returns {Promise<Object|null>} Réponse de l'API, ou `null` si elle est vide.
 * @throws {Error} Avec le message de l'API si la requête échoue.
 */
export async function removeFavorite(propertyId) {
  const response = await fetch(
    `/api/favoris/removeFavoris/${encodeURIComponent(propertyId)}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Erreur lors du retrait des favoris");
  }

  return data;
}
