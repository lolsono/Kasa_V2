import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const token = request.cookies.get("auth_token")?.value;

        // Aucun token = utilisateur non authentifié
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

        const response = await fetch(
            `${process.env.API_URL}/auth/profile`,
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
        if (!response.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: data.message || "Session invalide",
                },
                {
                    status: response.status,
                }
            );
        }
        return NextResponse.json(data);

    } catch (error) {
        console.error(
            "Erreur lors de la récupération de l'utilisateur :",
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
