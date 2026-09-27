import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        // Récupération du token
        const token = request.cookies.get("auth_token")?.value;

        // Utilisateur non authentifié
        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Utilisateur non authentifié",
                },
                {
                    status: 401,
                }
            );
        }

        // Récupération du paramètre query
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("query");

        // Vérification de la recherche
        if (!query || query.trim().length < 2) {
            return NextResponse.json(
                {
                    success: false,
                    message: "La recherche doit contenir au moins 2 caractères",
                },
                {
                    status: 400,
                }
            );
        }

        // Appel de ton véritable backend
        const response = await fetch(
            `${process.env.API_URL}/users/search?query=${encodeURIComponent(query)}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            }
        );

        const data = await response.json();

        // Erreur provenant du backend
        if (!response.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: data.message || "Impossible de rechercher les utilisateurs",
                },
                {
                    status: response.status,
                }
            );
        }

        // Retour des résultats au frontend
        return NextResponse.json(data);

    } catch (error) {
        console.error(
            "Erreur lors de la recherche des utilisateurs :",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Erreur interne du serveur",
            },
            {
                status: 500,
            }
        );
    }
}
