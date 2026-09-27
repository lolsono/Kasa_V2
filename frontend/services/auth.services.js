/**
 * Transforme les données utilisateur
 * reçues de l'API pour les adapter au frontend.
 * Le frontend utilise :
 * {
 *     firstName: "Alice",
 *     lastName: "Martin"
 * }
 */
function normalizeUser(user) {

    if (!user) {
        return null;
    }

    const nameParts = user.name?.trim().split(/\s+/) || [];

    const firstName = nameParts.shift() || "";
    const lastName = nameParts.join(" ");

    return {
        ...user,
        firstName,
        lastName,
    };
}


/**
 * Fonction de connexion utilisateur.
 * @param {*} email
 * @param {*} password
 * @returns
 */
export async function login(email, password) {

    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Erreur lors de la connexion"
        );
    }

    return {
        ...data,
        data: {
            ...data.data,
            user: normalizeUser(data.data.user),
        },
    };
}


/**
 * Récupère les informations de l'utilisateur connecté.
 */
export async function getCurrentUser() {

    const response = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Utilisateur non authentifié"
        );
    }

    return {
        ...data,
        data: {
            ...data.data,
            user: normalizeUser(data.data.user),
        },
    };
}

/* Fonction de déconnexion */
export async function logoutService() {
    const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la déconnexion");
    }

    return response.json();
}
