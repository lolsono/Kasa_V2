/**
 * Services des logements : interface entre les pages et les routes API
 * Next.js `/api/logement/*`.
 * @module services/logementServices
 */

/**
 * Récupère la liste de tous les logements.
 *
 * Envoie une requête `GET /api/logement/getlogements` sans mise en cache
 * (`cache: "no-store"`) pour toujours obtenir des données à jour.
 *
 * @async
 * @returns {Promise<Object[]>} La liste des logements renvoyée par l'API.
 * @throws {Error} Si l'API répond avec un statut d'erreur. Le message est
 *   `data.message` s'il existe, sinon « Erreure lors de la récupération des
 *   logement ».
 *
 * @example
 * const logements = await getLogements();
 */
export async function getLogements() {
  const response = await fetch("/api/logement/getlogements", {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreure lors de la récupération des logement",
    );
  }

  return data;
}

/**
 * Récupère un logement à partir de son identifiant.
 *
 * Envoie une requête `GET /api/logement/{id}` sans mise en cache. L'`id` est
 * encodé avec `encodeURIComponent` pour éviter toute injection dans l'URL.
 *
 * @async
 * @param {string} id - Identifiant du logement recherché.
 * @returns {Promise<Object>} Le logement renvoyé par l'API.
 * @throws {Error} Si l'API répond avec un statut d'erreur. L'erreur porte la
 *   propriété `status` (code HTTP, ex. `404` si le logement n'existe pas), ce
 *   qui permet à la page d'afficher un message adapté.
 *
 * @example
 * try {
 *   const logement = await getLogementById("abc123");
 * } catch (err) {
 *   if (err.status === 404) {
 *     // logement introuvable
 *   }
 * }
 */
export async function getLogementById(id) {
  const response = await fetch(`/api/logement/${encodeURIComponent(id)}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.message || "Erreur lors de la récupération du logement",
    );
    error.status = response.status;
    throw error;
  }

  return data;
}
