import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        // Récupération des données envoyées par le frontend
        const body = await request.json();

        const { name, email, password } = body;

        // Appel API REST
        const response = await fetch(
            `${process.env.API_URL}/auth/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    email,
                    password,
                    name,
                }),

                cache: "no-store",
            }
        );

        const data = await response.json();

        // L'API REST a retourné une erreur
        if (!response.ok || !data.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: data.message || "Erreur de création",
                },
                {
                    status: response.status || 401,
                }
            );
        }

        // Récupération du JWT
        const token = data.data?.token;

        if (!token) {
            console.error(
                "Le backend a répondu sans fournir de token JWT"
            );

            return NextResponse.json(
                {
                    success: false,
                    message: "Token absent de la réponse du serveur",
                },
                {
                    status: 500,
                }
            );
        }

        // Récupération des informations utilisateur
        const user = data.data?.user;

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
            }
        );

        // Création du cookie 7 jour
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
        console.error(
            "Erreur lors de la création :",
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
