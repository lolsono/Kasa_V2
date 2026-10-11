/* Fonction de récupération des logements */
export async function getLogements() {
  const response = await fetch("/api/logement/getlogements", {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreure lors de la récupération des logement",
    );
  }

  return data;
}

/* Fonction de recherche du logement par id */
export async function getLogementById(id) {
  const response = await fetch(`/api/logement/${encodeURIComponent(id)}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.message || "Erreur lors de la récupération du logement",
    );
    error.status = response.status;
    throw error;
  }

  return data;
}
