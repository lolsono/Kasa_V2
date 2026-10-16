import { NextResponse } from "next/server";

/**
 * Gère la connexion d'un utilisateur via une requête HTTP POST.
 *
 * Récupère l'adresse e-mail et le mot de passe envoyés dans le corps
 * de la requête, puis transmet ces identifiants à l'API REST.
 *
 * En cas de connexion réussie, récupère le token JWT et le profil
 * utilisateur, puis stocke le token dans un cookie HTTP-only
 * valable pendant 7 jours.
 *
 * @async
 * @param {Request} request - Requête HTTP contenant les identifiants
 * de connexion au format JSON.
 *
 * @returns {Promise<NextResponse>} Réponse JSON indiquant le résultat
 * de l'authentification. En cas de succès, contient les informations
 * utilisateur et définit un cookie contenant le token JWT.
 *
 * @throws {Error} En cas d'erreur lors de la lecture du corps de la
 * requête, de l'appel à l'API REST ou du traitement de la réponse.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const response = await fetch(`${process.env.API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const data = await response.json();

    /**
     * Vérifie si l'API REST a retourné une erreur HTTP.
     *
     * @returns {NextResponse} Réponse JSON contenant le message
     * d'erreur et le statut HTTP renvoyé par l'API.
     */
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Erreur de connexion",
        },
        { status: response.status || 401 },
      );
    }

    /**
     * Récupère le token JWT fourni par l'API REST.
     *
     * Le token est nécessaire pour établir la session
     * d'authentification côté serveur.
     */
    const token = data.token;

    /**
     * Vérifie que la réponse de l'API contient bien un token JWT.
     *
     * Si le token est absent, retourne une erreur serveur HTTP 500.
     */
    if (!token) {
      console.error("Le backend a répondu sans fournir de token JWT");

      return NextResponse.json(
        {
          success: false,
          message: "Token absent de la réponse du serveur",
        },
        { status: 500 },
      );
    }

    /**
     * Récupère les informations de l'utilisateur authentifié.
     *
     * @type {Object}
     */
    const user = data.user;

    /**
     * Construit la réponse JSON de connexion réussie.
     *
     * Les informations utilisateur sont placées dans la propriété data.
     *
     * @type {NextResponse}
     */
    const nextResponse = NextResponse.json(
      {
        success: true,
        message: data.message,
        data: {
          user,
        },
      },
      { status: 200 },
    );

    /**
     * Définit le cookie d'authentification contenant le token JWT.
     *
     * Le cookie est inaccessible depuis JavaScript côté client grâce
     * à l'option httpOnly. Il est limité au site et expire après
     * 7 jours.
     */
    nextResponse.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return nextResponse;
  } catch (error) {
    /**
     * Gère les erreurs inattendues survenues pendant le traitement
     * de la requête de connexion.
     *
     * @param {Error} error - Erreur rencontrée lors du traitement.
     */
    console.error("Erreur lors de la connexion :", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur interne du serveur",
      },
      { status: 500 },
    );
  }
}
