export async function signUpServices(name, email, password) {

    const response = await fetch("/api/signUp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            email,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(
            data.message || "Erreur lors de la création"
        );
    }

    return data;
}
