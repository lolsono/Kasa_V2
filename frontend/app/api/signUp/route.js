import { NextResponse } from "next/server";

/**
 * Gère l'inscription d'un nouvel utilisateur via une requête HTTP POST.
 *
 * Récupère les informations d'inscription envoyées dans le corps
 * de la requête, puis les transmet à l'API REST.
 *
 * Si l'inscription réussit, récupère le token JWT et les informations
 * de l'utilisateur, puis stocke le token dans un cookie HTTP-only
 * valable pendant 7 jours.
 *
 * En cas d'erreur, retourne la réponse du backend ou un message
 * d'erreur approprié.
 *
 * @async
 * @param {Request} request - Requête HTTP contenant les informations
 * d'inscription au format JSON.
 *
 * @returns {Promise<NextResponse>} Réponse JSON indiquant le résultat
 * de l'inscription. En cas de succès, contient les informations
 * utilisateur et définit un cookie d'authentification.
 *
 * @throws {Error} En cas d'erreur lors de la lecture de la requête,
 * de l'appel à l'API REST ou du traitement de la réponse.
 */
export async function POST(request) {
  try {
    /**
     * Récupère les données d'inscription envoyées par le client.
     */
    const body = await request.json();

    /**
     * Extrait les informations nécessaires à la création du compte.
     *
     * @type {Object}
     * @property {string} name - Nom de l'utilisateur.
     * @property {string} email - Adresse e-mail de l'utilisateur.
     * @property {string} password - Mot de passe du compte.
     * @property {string} role - Rôle attribué à l'utilisateur.
     */
    const { name, email, password, role } = body;

    console.log(body);

    /**
     * Transmet les informations d'inscription à l'API REST.
     *
     * L'option `cache: "no-store"` empêche la mise en cache
     * de la réponse.
     */
    const response = await fetch(`${process.env.API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name,
        role,
      }),
      cache: "no-store",
    });

    /**
     * Convertit la réponse du backend en objet JavaScript
     * à partir de son contenu JSON.
     */
    const data = await response.json();

    /**
     * Vérifie si l'API REST a retourné une erreur HTTP.
     *
     * Si l'inscription échoue, transmet directement au client
     * la réponse JSON du backend avec son statut HTTP.
     */
    if (!response.ok) {
      return NextResponse.json(data, {
        status: response.status,
      });
    }

    /**
     * Récupère le token JWT fourni par le backend après
     * la création du compte.
     */
    const token = data.data?.token;

    /**
     * Vérifie la présence du token JWT dans la réponse.
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
        {
          status: 500,
        },
      );
    }

    /**
     * Récupère les informations de l'utilisateur créé
     * depuis la réponse du backend.
     */
    const user = data.data?.user;

    /**
     * Construit la réponse JSON confirmant la réussite
     * de l'inscription et contenant les informations utilisateur.
     */
    const nextResponse = NextResponse.json(
      {
        success: true,
        message: data.message,
        data: {
          user,
        },
      },
      {
        status: 200,
      },
    );

    /**
     * Définit le cookie d'authentification contenant le token JWT.
     *
     * Le cookie est inaccessible depuis JavaScript côté client
     * grâce à l'option `httpOnly` et expire après 7 jours.
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
     * Gère les erreurs inattendues survenues pendant la création
     * du compte utilisateur.
     */
    console.error("Erreur lors de la création :", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur interne du serveur",
      },
      {
        status: 500,
      },
    );
  }
}
