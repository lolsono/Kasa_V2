/**
 * Fonction de récupération des logements.
 */
export async function getLogements() {

    const response = await fetch("/api/logement/getlogements", {
        method: "GET",
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Erreure lors de la récupération des logement"
        );
    }

    return data;
}