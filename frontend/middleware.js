import { NextResponse } from "next/server";

export function middleware(request) {
    const token = request.cookies.get("auth_token");

    if (!token) {
        return NextResponse.redirect(
            new URL("/connexion/login", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/compte/:path*",
        "/projet/:path*",
        "/dashboard/:path*",
    ],
};
