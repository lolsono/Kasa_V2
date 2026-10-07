/*
 * Par défaut le compte est créé en client.
 */
export async function signUpServices(name, email, password) {
  const role = "client";

  const response = await fetch("/api/signUp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      role,
    }),
  });

  const data = await response.json();

  // L'API a retourné une erreur
  if (!response.ok) {
    throw new Error(data.error || "Erreur lors de la création");
  }

  return data;
}
