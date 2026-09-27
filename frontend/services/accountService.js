export async function updateProfile({ name, email }) {
    const response = await fetch("/api/user/me", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            email,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Impossible de modifier les informations."
        );
    }

    return data;
}

export async function updatePassword({
    currentPassword,
    newPassword,
}) {
    const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            currentPassword,
            newPassword,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Impossible de modifier le mot de passe."
        );
    }

    return data;
}
