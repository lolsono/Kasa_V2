import { NextResponse } from "next/server";

/**
 * Route GET /api/favoris/getFavoris/{id}
 *
 * Récupère les favoris d'un utilisateur auprès du backend.
 * Le token est lu dans le cookie httpOnly `auth_token` puis transmis en
 * `Authorization: Bearer`.
 *
 * Réponses :
 * - 200 : liste des favoris renvoyée par l'API ;
 * - 401 : cookie `auth_token` absent ;
 * - code de l'API : erreur renvoyée par le backend, avec son message ;
 * - 500 : erreur interne (backend injoignable, etc.).
 *
 * @param {import("next/server").NextRequest} request
 * @param {{ params: Promise<{ id: string }> }} context - `id` = id de l'utilisateur.
 * @returns {Promise<NextResponse>}
 */
export async function GET(request, { params }) {
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

    // TODO : adapte l'URL à celle de ton backend
    const response = await fetch(
      `${process.env.API_URL}/api/users/${encodeURIComponent(id)}/favorites`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    // Erreur provenant de l'API : on renvoie son message
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Impossible de récupérer les favoris",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris :", error);

    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
