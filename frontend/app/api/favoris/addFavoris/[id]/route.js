import { NextResponse } from "next/server";

/**
 * Route POST /api/favoris/addFavoris/{id}
 *
 * Ajoute un logement aux favoris auprès du backend.
 * Le body de la requête (`{ user_id, score, comment }`) est transmis tel quel.
 * Le token est lu dans le cookie httpOnly `auth_token` puis transmis en
 * `Authorization: Bearer`.
 *
 * Réponses :
 * - code de l'API (200/201) : réponse du backend ;
 * - 401 : cookie `auth_token` absent ;
 * - code de l'API : erreur renvoyée par le backend, avec son message ;
 * - 500 : erreur interne.
 *
 * @param {import("next/server").NextRequest} request
 * @param {{ params: Promise<{ id: string }> }} context - `id` = id du logement.
 * @returns {Promise<NextResponse>}
 */
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Utilisateur non authentifié",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();

    // TODO : adapte l'URL à celle de ton backend
    const response = await fetch(
      `${process.env.API_URL}/api/properties/${encodeURIComponent(id)}/favorite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );

    const data = await response.json();

    // Erreur provenant de l'API : on renvoie son message
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Impossible d'ajouter aux favoris",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Erreur lors de l'ajout aux favoris :", error);

    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
