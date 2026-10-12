/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GET } from "@/app/api/favoris/getFavoris/[id]/route";
import { POST } from "@/app/api/favoris/addFavoris/[id]/route";
import { DELETE } from "@/app/api/favoris/removeFavoris/[id]/route";

const API_URL = "http://api.test";

/** Construit une requête Next, avec ou sans cookie d'authentification */
function makeRequest(url, { method = "GET", token = "abc", body } = {}) {
  const headers = {};
  if (token) headers.cookie = `auth_token=${token}`;
  if (body) headers["content-type"] = "application/json";

  return new NextRequest(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

/** Les routes reçoivent leurs params sous forme de Promise */
const paramsFor = (id) => ({ params: Promise.resolve({ id }) });

/** Prépare la réponse du backend */
function mockBackend({ ok = true, status = 200, body = {} } = {}) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  });
}

let consoleErrorSpy;

beforeAll(() => {
  process.env.API_URL = API_URL;
});

beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
});

describe("GET /api/favoris/getFavoris/[id]", () => {
  const url = "http://localhost/api/favoris/getFavoris/14";

  it("renvoie 401 sans cookie auth_token et n'appelle pas le backend", async () => {
    mockBackend();

    const res = await GET(makeRequest(url, { token: null }), paramsFor("14"));

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({
      success: false,
      message: "Utilisateur non authentifié",
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("appelle le backend avec le token en Bearer et renvoie sa réponse", async () => {
    const favoris = [{ id: "a", title: "Appartement cosy" }];
    mockBackend({ body: favoris });

    const res = await GET(makeRequest(url), paramsFor("14"));

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/api/users/14/favorites`,
      expect.objectContaining({
        headers: { Authorization: "Bearer abc" },
      })
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(favoris);
  });

  it("renvoie le message et le code d'erreur de l'API", async () => {
    mockBackend({ ok: false, status: 403, body: { message: "Accès refusé" } });

    const res = await GET(makeRequest(url), paramsFor("14"));

    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({
      success: false,
      message: "Accès refusé",
    });
  });

  it("utilise un message par défaut si l'API n'en renvoie pas", async () => {
    mockBackend({ ok: false, status: 500, body: {} });

    const res = await GET(makeRequest(url), paramsFor("14"));

    expect((await res.json()).message).toBe(
      "Impossible de récupérer les favoris"
    );
  });

  it("renvoie 500 si le backend est injoignable", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("réseau"));

    const res = await GET(makeRequest(url), paramsFor("14"));

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      success: false,
      message: "Erreur interne du serveur",
    });
  });
});

describe("POST /api/favoris/addFavoris/[id]", () => {
  const url = "http://localhost/api/favoris/addFavoris/abc";
  const body = { user_id: 14, score: 5, comment: "" };

  it("renvoie 401 sans cookie auth_token et n'appelle pas le backend", async () => {
    mockBackend();

    const res = await POST(
      makeRequest(url, { method: "POST", token: null, body }),
      paramsFor("abc")
    );

    expect(res.status).toBe(401);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("transmet le body et le token au backend", async () => {
    mockBackend({ status: 201, body: { id: 1 } });

    const res = await POST(
      makeRequest(url, { method: "POST", body }),
      paramsFor("abc")
    );

    const [calledUrl, options] = fetch.mock.calls[0];
    expect(calledUrl).toBe(`${API_URL}/api/properties/abc/favorite`);
    expect(options.method).toBe("POST");
    expect(options.headers.Authorization).toBe("Bearer abc");
    expect(JSON.parse(options.body)).toEqual(body);
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ id: 1 });
  });

  it("renvoie le message et le code d'erreur de l'API", async () => {
    mockBackend({
      ok: false,
      status: 409,
      body: { message: "Déjà dans vos favoris" },
    });

    const res = await POST(
      makeRequest(url, { method: "POST", body }),
      paramsFor("abc")
    );

    expect(res.status).toBe(409);
    expect((await res.json()).message).toBe("Déjà dans vos favoris");
  });

  it("renvoie 500 si le backend est injoignable", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("réseau"));

    const res = await POST(
      makeRequest(url, { method: "POST", body }),
      paramsFor("abc")
    );

    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/favoris/removeFavoris/[id]", () => {
  const url = "http://localhost/api/favoris/removeFavoris/abc";

  it("renvoie 401 sans cookie auth_token et n'appelle pas le backend", async () => {
    mockBackend();

    const res = await DELETE(
      makeRequest(url, { method: "DELETE", token: null }),
      paramsFor("abc")
    );

    expect(res.status).toBe(401);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("envoie un DELETE au backend avec le token", async () => {
    mockBackend({ body: { success: true } });

    const res = await DELETE(
      makeRequest(url, { method: "DELETE" }),
      paramsFor("abc")
    );

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/api/properties/abc/favorite`,
      expect.objectContaining({
        method: "DELETE",
        headers: { Authorization: "Bearer abc" },
      })
    );
    expect(res.status).toBe(200);
  });

  it("accepte une réponse du backend sans contenu", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 204,
      json: () => Promise.reject(new Error("pas de body")),
    });

    const res = await DELETE(
      makeRequest(url, { method: "DELETE" }),
      paramsFor("abc")
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
  });

  it("renvoie le message et le code d'erreur de l'API", async () => {
    mockBackend({
      ok: false,
      status: 404,
      body: { message: "Favori introuvable" },
    });

    const res = await DELETE(
      makeRequest(url, { method: "DELETE" }),
      paramsFor("abc")
    );

    expect(res.status).toBe(404);
    expect((await res.json()).message).toBe("Favori introuvable");
  });

  it("renvoie 500 si le backend est injoignable", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("réseau"));

    const res = await DELETE(
      makeRequest(url, { method: "DELETE" }),
      paramsFor("abc")
    );

    expect(res.status).toBe(500);
  });
});
