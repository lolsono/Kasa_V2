import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
        const token = request.cookies.get("auth_token")?.value;

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

        const {
            currentPassword,
            newPassword,
        } = await request.json();

        const response = await fetch(
            `${process.env.API_URL}/auth/password`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        data.message ||
                        "Impossible de modifier le mot de passe.",
                },
                {
                    status: response.status,
                }
            );
        }

        return NextResponse.json(data);

    } catch (error) {

        console.error(
            "Erreur lors de la modification du mot de passe :",
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
