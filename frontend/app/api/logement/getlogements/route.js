import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(`${process.env.API_URL}/api/properties`, {
      cache: "no-store",
    });

    const data = await response.json();

    // Erreur provenant du backend
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Impossible de récupérer les logements",
        },
        { status: response.status },
      );
    }

    // On renvoie directement le JSON du backend
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des logements :", error);

    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
