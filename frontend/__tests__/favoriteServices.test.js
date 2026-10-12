import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "@/services/favoriteServices";

/** Prépare la réponse renvoyée par fetch */
function mockFetch({ ok = true, status = 200, body = {} } = {}) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  });
}

describe("addFavorite", () => {
  it("envoie un POST avec l'id du logement dans l'URL et le body attendu", async () => {
    mockFetch({ body: { success: true } });

    const result = await addFavorite("abc", 14);

    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe("/api/favoris/addFavoris/abc");
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body)).toEqual({
      user_id: 14,
      score: 5,
      comment: "",
    });
    expect(result).toEqual({ success: true });
  });

  it("lance une erreur avec le message renvoyé par l'API", async () => {
    mockFetch({
      ok: false,
      status: 401,
      body: { message: "Utilisateur non authentifié" },
    });

    await expect(addFavorite("abc", 14)).rejects.toThrow(
      "Utilisateur non authentifié"
    );
  });

  it("utilise un message par défaut si l'API n'en fournit pas", async () => {
    mockFetch({ ok: false, status: 500, body: {} });

    await expect(addFavorite("abc", 14)).rejects.toThrow(
      "Erreur lors de l'ajout aux favoris"
    );
  });
});

describe("getFavorites", () => {
  it("appelle la route avec l'id de l'utilisateur et renvoie les logements", async () => {
    const logements = [
      { id: "a", title: "Appartement cosy" },
      { id: "b", title: "Studio de charme" },
    ];
    mockFetch({ body: logements });

    const result = await getFavorites(14);

    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe("/api/favoris/getFavoris/14");
    expect(options.method).toBe("GET");
    expect(result).toEqual(logements);
  });

  it("extrait le logement quand il est dans une clé `property`", async () => {
    mockFetch({
      body: [{ id: 1, property: { id: "a", title: "Appartement cosy" } }],
    });

    const result = await getFavorites(14);

    expect(result).toEqual([{ id: "a", title: "Appartement cosy" }]);
  });

  it("lance une erreur avec le message renvoyé par l'API", async () => {
    mockFetch({
      ok: false,
      status: 403,
      body: { message: "Accès refusé" },
    });

    await expect(getFavorites(14)).rejects.toThrow("Accès refusé");
  });
});

describe("removeFavorite", () => {
  it("envoie un DELETE avec l'id du logement dans l'URL", async () => {
    mockFetch({ body: { success: true } });

    const result = await removeFavorite("abc");

    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe("/api/favoris/removeFavoris/abc");
    expect(options.method).toBe("DELETE");
    expect(result).toEqual({ success: true });
  });

  it("accepte une réponse sans contenu", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 204,
      json: () => Promise.reject(new Error("pas de body")),
    });

    await expect(removeFavorite("abc")).resolves.toBeNull();
  });

  it("lance une erreur avec le message renvoyé par l'API", async () => {
    mockFetch({
      ok: false,
      status: 404,
      body: { message: "Favori introuvable" },
    });

    await expect(removeFavorite("abc")).rejects.toThrow("Favori introuvable");
  });
});
