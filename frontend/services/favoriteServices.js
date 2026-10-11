import { getUser } from "@/services/sessionStorageServices";

async function parseResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Une erreur est survenue");
    error.status = response.status;
    throw error;
  }

  return data;
}

// fonction ajout en favoris
export async function addFavorite(propertyId) {
  const user = getUser();

  if (!user?.id) {
    const error = new Error("Vous devez être connecté");
    error.status = 401;
    throw error;
  }

  const response = await fetch(
    `/api/favoris/addFavoris/${encodeURIComponent(propertyId)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        score: 5,
        comment: "",
      }),
    },
  );

  return parseResponse(response);
}

// fonction de récupération des favories
export async function getFavorites(userId) {
  const response = await fetch(
    `/api/favoris/getFavoris/${encodeURIComponent(userId)}`,
    { method: "GET", cache: "no-store" },
  );

  const data = await parseResponse(response);
  return data.map((item) => item.property ?? item);
}

// Retirer un logement des favoris (DELETE)
export async function removeFavorite(propertyId) {
  const response = await fetch(
    `/api/favoris/removeFavoris/${encodeURIComponent(propertyId)}`,
    {
      method: "DELETE",
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Erreur lors du retrait des favoris");
  }

  return data;
}
