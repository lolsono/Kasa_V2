import { NextResponse } from "next/server";

/**
 * Récupère les informations d'un logement à partir de son identifiant.
 *
 * Extrait l'identifiant depuis les paramètres dynamiques de la route,
 * puis effectue une requête GET vers l'API REST pour récupérer
 * les informations du logement correspondant.
 *
 * La réponse de l'API est transmise au client si la requête réussit.
 * En cas d'erreur, un message explicatif et un statut HTTP approprié
 * sont retournés.
 *
 * @async
 * @param {Request} request - Objet représentant la requête HTTP entrante.
 * @param {Object} context - Contexte de la route dynamique Next.js.
 * @param {Promise<Object>} context.params - Paramètres dynamiques
 * de la route contenant l'identifiant du logement.
 * @param {string} context.params.id - Identifiant du logement à récupérer.
 *
 * @returns {Promise<NextResponse>} Réponse JSON contenant les données
 * du logement ou un message d'erreur.
 *
 * @throws {Error} En cas d'erreur lors de la récupération ou du traitement
 * des données du logement.
 */
export async function GET(request, { params }) {
  try {
    /**
     * Récupère l'identifiant du logement depuis les paramètres
     * dynamiques de la route.
     */
    const { id } = await params;

    /**
     * Interroge l'API REST pour récupérer les informations du logement.
     *
     * L'identifiant est encodé afin de sécuriser son intégration
     * dans l'URL.
     *
     * L'option `cache: "no-store"` empêche la mise en cache
     * de la réponse.
     */
    const response = await fetch(
      `${process.env.API_URL}/api/properties/${encodeURIComponent(id)}`,
      { cache: "no-store" },
    );

    /**
     * Convertit la réponse de l'API REST en objet JavaScript
     * à partir du contenu JSON.
     */
    const data = await response.json();

    /**
     * Vérifie si l'API REST a retourné une erreur HTTP.
     *
     * Si la requête échoue, transmet le statut HTTP de l'API
     * et retourne un message d'erreur au client.
     */
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Impossible de récupérer le logement",
        },
        { status: response.status },
      );
    }

    /**
     * Retourne les données du logement au format JSON
     * lorsque la requête a réussi.
     */
    return NextResponse.json(data);
  } catch (error) {
    /**
     * Gère les erreurs inattendues survenues pendant la récupération
     * des informations du logement.
     */
    console.error("Erreur lors de la récupération du logement :", error);

    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
