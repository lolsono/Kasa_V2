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

    console.log(data);
    return data;
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
