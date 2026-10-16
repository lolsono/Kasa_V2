import { NextResponse } from "next/server";

/**
 * Récupère la liste des logements depuis l'API REST.
 *
 * Effectue une requête HTTP GET vers le backend pour obtenir
 * les logements, puis transmet les données reçues au client
 * au format JSON.
 *
 * Si le backend retourne une erreur HTTP, la route transmet
 * le statut correspondant et un message explicatif.
 *
 * @async
 * @returns {Promise<NextResponse>} Réponse JSON contenant les données
 * des logements ou un message d'erreur.
 *
 * @throws {Error} En cas d'erreur lors de la requête au backend
 * ou du traitement de la réponse.
 */
export async function GET() {
  try {
    /**
     * Envoie une requête GET au backend pour récupérer les logements.
     *
     * L'option `cache: "no-store"` désactive la mise en cache
     * de la réponse afin de récupérer des données actualisées.
     */
    const response = await fetch(`${process.env.API_URL}/api/properties`, {
      cache: "no-store",
    });

    /**
     * Convertit la réponse JSON du backend en objet JavaScript.
     */
    const data = await response.json();

    /**
     * Vérifie si la requête vers le backend a échoué.
     *
     * Retourne le message d'erreur fourni par le backend ou,
     * à défaut, un message générique avec le statut HTTP reçu.
     */
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Impossible de récupérer les logements",
        },
        { status: response.status },
      );
    }

    /**
     * Retourne directement les données reçues du backend
     * lorsque la requête a réussi.
     */
    return NextResponse.json(data);
  } catch (error) {
    /**
     * Gère les erreurs inattendues survenues pendant la récupération
     * des logements et retourne une erreur HTTP 500.
     */
    console.error("Erreur lors de la récupération des logements :", error);

    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
