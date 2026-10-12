import {
  clearFavoriteIds,
  clearUser,
  getFavoriteIds,
  getUser,
  saveFavoriteIds,
  saveUser,
} from "@/services/sessionStorageServices";

const USER_KEY = "kasa_user";
const FAVORITES_KEY = "kasa_favorites";

describe("sessionStorageServices - favoris", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renvoie un tableau vide quand rien n'est stocké", () => {
    expect(getFavoriteIds()).toEqual([]);
  });

  it("sauvegarde puis relit les ids", () => {
    saveFavoriteIds(["a", "b"]);

    expect(getFavoriteIds()).toEqual(["a", "b"]);
    expect(JSON.parse(localStorage.getItem(FAVORITES_KEY))).toEqual(["a", "b"]);
  });

  it("renvoie [] et supprime la clé quand le JSON est invalide", () => {
    localStorage.setItem(FAVORITES_KEY, "{pas du json");

    expect(getFavoriteIds()).toEqual([]);
    expect(localStorage.getItem(FAVORITES_KEY)).toBeNull();
  });

  it("renvoie [] quand la valeur stockée n'est pas un tableau", () => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify({ a: 1 }));

    expect(getFavoriteIds()).toEqual([]);
  });

  it("clearFavoriteIds supprime les favoris", () => {
    saveFavoriteIds(["a"]);

    clearFavoriteIds();

    expect(localStorage.getItem(FAVORITES_KEY)).toBeNull();
  });
});

describe("sessionStorageServices - utilisateur", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("sauvegarde puis relit l'utilisateur", () => {
    const user = { id: 14, name: "Felix", role: "client" };

    saveUser(user);

    expect(getUser()).toEqual(user);
  });

  it("renvoie null quand aucun utilisateur n'est stocké", () => {
    expect(getUser()).toBeNull();
  });

  it("clearUser supprime l'utilisateur ET ses favoris", () => {
    saveUser({ id: 14 });
    saveFavoriteIds(["a", "b"]);

    clearUser();

    expect(localStorage.getItem(USER_KEY)).toBeNull();
    expect(localStorage.getItem(FAVORITES_KEY)).toBeNull();
  });
});
