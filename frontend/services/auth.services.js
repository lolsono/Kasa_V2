/**
 * Services d'authentification : interface entre les pages et les routes
 * API Next.js `/api/auth/*`.
 * @module services/authServices
 */

/**
 * Connecte un utilisateur à partir de son email et de son mot de passe.
 *
 * Envoie une requête `POST /api/auth/login` avec les identifiants au format JSON.
 *
 * @async
 * @param {string} email - Adresse email de l'utilisateur.
 * @param {string} password - Mot de passe de l'utilisateur.
 * @returns {Promise<Object>} Les données renvoyées par l'API en cas de succès.
 * @throws {Error} Si l'API répond avec un statut d'erreur. Le message est
 *   `data.message` s'il existe, sinon « Erreur lors de la connexion ».
 *
 * @example
 * try {
 *   const user = await login("alice@mail.com", "monMotDePasse");
 * } catch (err) {
 *   console.error(err.message);
 * }
 */
export async function login(email, password) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors de la connexion");
  }

  console.log(data);
  return data;
}

/**
 * Déconnecte l'utilisateur courant.
 *
 * Envoie une requête `POST /api/auth/logout` avec `credentials: "include"`
 * afin que le cookie de session soit transmis au serveur.
 *
 * @async
 * @returns {Promise<Object>} Les données renvoyées par l'API en cas de succès.
 * @throws {Error} « Erreur lors de la déconnexion » si l'API répond avec un
 *   statut d'erreur.
 *
 * @example
 * await logoutService();
 * router.push("/login");
 */
export async function logoutService() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la déconnexion");
  }

  return response.json();
}
