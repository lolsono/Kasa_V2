import { act, renderHook, waitFor } from "@testing-library/react";
import { FavoritesProvider, useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import * as favoriteServices from "@/services/favoriteServices";

jest.mock("@/context/AuthContext", () => ({ useAuth: jest.fn() }));
jest.mock("@/services/favoriteServices");

const FAVORITES_KEY = "kasa_favorites";

const wrapper = ({ children }) => (
  <FavoritesProvider>{children}</FavoritesProvider>
);

/** Affiche le hook et attend la fin du premier chargement */
async function renderReady() {
  const utils = renderHook(() => useFavorites(), { wrapper });
  await waitFor(() => expect(utils.result.current.ready).toBe(true));
  return utils;
}

let consoleErrorSpy;

beforeEach(() => {
  jest.resetAllMocks();
  localStorage.clear();
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  useAuth.mockReturnValue({ user: { id: 14 }, loading: false });
  favoriteServices.getFavorites.mockResolvedValue([]);
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
});

describe("FavoritesProvider - chargement", () => {
  it("charge les favoris de l'API pour un utilisateur connecté", async () => {
    favoriteServices.getFavorites.mockResolvedValue([{ id: "a" }, { id: "b" }]);

    const { result } = await renderReady();

    expect(favoriteServices.getFavorites).toHaveBeenCalledWith(14);
    expect(result.current.ids).toEqual(["a", "b"]);
    expect(result.current.isFavorite("a")).toBe(true);
    expect(result.current.isFavorite("z")).toBe(false);
    expect(JSON.parse(localStorage.getItem(FAVORITES_KEY))).toEqual(["a", "b"]);
  });

  it("affiche d'abord la copie locale pendant que l'API répond", async () => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(["x"]));
    favoriteServices.getFavorites.mockReturnValue(new Promise(() => {})); // jamais résolue

    const { result } = renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => expect(result.current.ids).toEqual(["x"]));
    expect(result.current.ready).toBe(false);
  });

  it("n'appelle pas l'API et vide les favoris si personne n'est connecté", async () => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(["x"]));
    useAuth.mockReturnValue({ user: null, loading: false });

    const { result } = await renderReady();

    expect(favoriteServices.getFavorites).not.toHaveBeenCalled();
    expect(result.current.ids).toEqual([]);
    expect(localStorage.getItem(FAVORITES_KEY)).toBeNull();
  });

  it("attend la fin du chargement de l'authentification", () => {
    useAuth.mockReturnValue({ user: null, loading: true });

    const { result } = renderHook(() => useFavorites(), { wrapper });

    expect(favoriteServices.getFavorites).not.toHaveBeenCalled();
    expect(result.current.ready).toBe(false);
  });

  it("garde la copie locale si l'API échoue", async () => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(["x"]));
    favoriteServices.getFavorites.mockRejectedValue(new Error("API HS"));

    const { result } = await renderReady();

    expect(result.current.ids).toEqual(["x"]);
  });
});

describe("FavoritesProvider - addFavorite", () => {
  it("ajoute l'id tout de suite (optimiste) puis appelle l'API", async () => {
    const { result } = await renderReady();

    let resolveRequest;
    favoriteServices.addFavorite.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );

    let promise;
    act(() => {
      promise = result.current.addFavorite("c");
    });

    // L'id est déjà là avant la réponse de l'API
    expect(result.current.ids).toContain("c");
    expect(result.current.isFavorite("c")).toBe(true);

    await act(async () => {
      resolveRequest({ success: true });
      await promise;
    });

    expect(favoriteServices.addFavorite).toHaveBeenCalledWith("c", 14);
    expect(JSON.parse(localStorage.getItem(FAVORITES_KEY))).toEqual(["c"]);
  });

  it("annule l'ajout et relance l'erreur si l'API refuse", async () => {
    const { result } = await renderReady();
    favoriteServices.addFavorite.mockRejectedValue(new Error("boom"));

    await act(async () => {
      await expect(result.current.addFavorite("c")).rejects.toThrow("boom");
    });

    expect(result.current.isFavorite("c")).toBe(false);
    expect(JSON.parse(localStorage.getItem(FAVORITES_KEY))).toEqual([]);
  });

  it("refuse l'ajout si l'utilisateur n'est pas connecté", async () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    const { result } = await renderReady();

    await act(async () => {
      await expect(result.current.addFavorite("c")).rejects.toThrow(
        "Vous devez être connecté"
      );
    });

    expect(favoriteServices.addFavorite).not.toHaveBeenCalled();
    expect(result.current.ids).toEqual([]);
  });

  it("n'ajoute pas deux fois le même id", async () => {
    favoriteServices.getFavorites.mockResolvedValue([{ id: "a" }]);
    favoriteServices.addFavorite.mockResolvedValue({});
    const { result } = await renderReady();

    await act(async () => {
      await result.current.addFavorite("a");
    });

    expect(result.current.ids).toEqual(["a"]);
  });
});

describe("FavoritesProvider - removeFavorite", () => {
  it("retire l'id puis appelle l'API", async () => {
    favoriteServices.getFavorites.mockResolvedValue([{ id: "a" }, { id: "b" }]);
    favoriteServices.removeFavorite.mockResolvedValue({});
    const { result } = await renderReady();

    await act(async () => {
      await result.current.removeFavorite("a");
    });

    expect(favoriteServices.removeFavorite).toHaveBeenCalledWith("a");
    expect(result.current.ids).toEqual(["b"]);
    expect(JSON.parse(localStorage.getItem(FAVORITES_KEY))).toEqual(["b"]);
  });

  it("remet le favori et relance l'erreur si l'API refuse", async () => {
    favoriteServices.getFavorites.mockResolvedValue([{ id: "a" }]);
    favoriteServices.removeFavorite.mockRejectedValue(new Error("boom"));
    const { result } = await renderReady();

    await act(async () => {
      await expect(result.current.removeFavorite("a")).rejects.toThrow("boom");
    });

    expect(result.current.isFavorite("a")).toBe(true);
  });
});

describe("useFavorites", () => {
  it("lance une erreur en dehors d'un FavoritesProvider", () => {
    expect(() => renderHook(() => useFavorites())).toThrow(
      "useFavorites doit être utilisé dans un <FavoritesProvider>"
    );
  });
});
