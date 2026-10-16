import { NextResponse } from "next/server";

/**
 * Gère la déconnexion d'un utilisateur via une requête HTTP POST.
 *
 * Supprime le cookie d'authentification `auth_token` en lui attribuant
 * une date d'expiration passée afin de mettre fin à la session côté client.
 *
 * @async
 * @returns {Promise<NextResponse>} Réponse JSON confirmant la déconnexion
 * et contenant le cookie d'authentification expiré.
 */
export async function POST() {
  /**
   * Crée une réponse JSON confirmant la réussite de la déconnexion.
   *
   * @type {NextResponse}
   */
  const response = NextResponse.json({
    message: "Déconnexion réussie",
  });

  /**
   * Invalide le cookie d'authentification `auth_token`.
   *
   * L'option `httpOnly` empêche l'accès au cookie depuis JavaScript
   * côté client. La date d'expiration passée demande au navigateur
   * de supprimer le cookie.
   *
   * L'option `path: "/"` permet de cibler le cookie défini
   * à la racine de l'application.
   */
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
