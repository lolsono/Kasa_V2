/**
 * Service d'inscription : interface entre la page de création de compte et
 * la route API Next.js `/api/signUp`.
 * @module services/signUpServices
 */

/**
 * Crée un nouveau compte utilisateur.
 *
 * Envoie une requête `POST /api/signUp` au format JSON. Le rôle est fixé à
 * `"client"` : tout compte créé via ce service est un compte client.
 *
 * @async
 * @param {string} name - Nom de l'utilisateur.
 * @param {string} email - Adresse email de l'utilisateur.
 * @param {string} password - Mot de passe choisi.
 * @returns {Promise<Object>} Les données renvoyées par l'API en cas de succès.
 * @throws {Error} Si l'API répond avec un statut d'erreur. Le message est
 *   `data.error` s'il existe, sinon « Erreur lors de la création ».
 *
 * @example
 * try {
 *   await signUpServices("Alice", "alice@mail.com", "monMotDePasse");
 * } catch (err) {
 *   console.error(err.message);
 * }
 */
export async function signUpServices(name, email, password) {
  const role = "client";

  const response = await fetch("/api/signUp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      role,
    }),
  });

  const data = await response.json();

  // L'API a retourné une erreur
  if (!response.ok) {
    throw new Error(data.error || "Erreur lors de la création");
  }

  return data;
}
