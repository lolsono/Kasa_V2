import { NextResponse } from "next/server";

// GET /api/favoris/getFavoris/14   (14 = id de l'utilisateur)
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
