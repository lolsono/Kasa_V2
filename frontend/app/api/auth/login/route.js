import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const response = await fetch(`${process.env.API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const data = await response.json();

    // L'API REST a retourné une erreur
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Erreur de connexion",
        },
        { status: response.status || 401 },
      );
    }

    // L'API renvoie { token, user } directement à la racine
    const token = data.token;

    if (!token) {
      console.error("Le backend a répondu sans fournir de token JWT");

      return NextResponse.json(
        {
          success: false,
          message: "Token absent de la réponse du serveur",
        },
        { status: 500 },
      );
    }

    const user = data.user;

    const nextResponse = NextResponse.json(
      {
        success: true,
        message: data.message,
        data: {
          user,
        },
      },
      { status: 200 },
    );

    // Création du cookie 7 jours
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
    console.error("Erreur lors de la connexion :", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur interne du serveur",
      },
      { status: 500 },
    );
  }
}
