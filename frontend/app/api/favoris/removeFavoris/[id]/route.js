import { NextResponse } from "next/server";

/**
 * Route DELETE /api/favoris/removeFavoris/{id}
 *
 * Retire un logement des favoris auprès du backend.
 * Le token est lu dans le cookie httpOnly `auth_token` puis transmis en
 * `Authorization: Bearer`. Une réponse du backend sans contenu (204) est
 * acceptée et renvoyée sous la forme `{ success: true }`.
 *
 * Réponses :
 * - 200 : retrait effectué ;
 * - 401 : cookie `auth_token` absent ;
 * - code de l'API : erreur renvoyée par le backend, avec son message ;
 * - 500 : erreur interne.
 *
 * @param {import("next/server").NextRequest} request
 * @param {{ params: Promise<{ id: string }> }} context - `id` = id du logement.
 * @returns {Promise<NextResponse>}
 */
export async function DELETE(request, { params }) {
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
      `${process.env.API_URL}/api/properties/${encodeURIComponent(id)}/favorite`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    // Un DELETE peut répondre sans body (204) : on évite de planter
    const data = await response.json().catch(() => null);

    // Erreur provenant de l'API : on renvoie son message
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message || "Impossible de retirer des favoris",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data ?? { success: true });
  } catch (error) {
    console.error("Erreur lors du retrait des favoris :", error);

    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
