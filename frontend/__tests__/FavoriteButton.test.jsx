import { act, fireEvent, render, screen } from "@testing-library/react";
import FavoriteButton from "@/components/LogementCard/FavoriteButton";
import { useFavorites } from "@/context/FavoritesContext";

jest.mock("@/context/FavoritesContext", () => ({ useFavorites: jest.fn() }));

let addFavorite;
let removeFavorite;
let consoleErrorSpy;

/** Prépare le Context : le logement est-il déjà en favori ? */
function setup({ active = false } = {}) {
  addFavorite = jest.fn().mockResolvedValue(undefined);
  removeFavorite = jest.fn().mockResolvedValue(undefined);

  useFavorites.mockReturnValue({
    isFavorite: () => active,
    addFavorite,
    removeFavorite,
  });

  render(<FavoriteButton id="abc" title="Appartement cosy" />);

  return screen.getByRole("button");
}

beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
  jest.useRealTimers();
});

describe("FavoriteButton - affichage", () => {
  it("n'est pas pressé quand le logement n'est pas en favori", () => {
    const button = setup({ active: false });

    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveAccessibleName("Ajouter Appartement cosy aux favoris");
  });

  it("est pressé quand le logement est en favori", () => {
    const button = setup({ active: true });

    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAccessibleName("Retirer Appartement cosy des favoris");
  });
});

describe("FavoriteButton - clic", () => {
  it("ajoute le logement quand il n'est pas en favori", async () => {
    const button = setup({ active: false });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(addFavorite).toHaveBeenCalledWith("abc");
    expect(removeFavorite).not.toHaveBeenCalled();
  });

  it("retire le logement quand il est déjà en favori", async () => {
    const button = setup({ active: true });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(removeFavorite).toHaveBeenCalledWith("abc");
    expect(addFavorite).not.toHaveBeenCalled();
  });

  it("ignore les clics tant que la requête est en cours", async () => {
    const button = setup({ active: false });

    let resolveRequest;
    addFavorite.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );

    fireEvent.click(button);
    fireEvent.click(button);

    expect(addFavorite).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveRequest();
    });
  });
});

describe("FavoriteButton - erreurs", () => {
  it("affiche le message renvoyé par l'API", async () => {
    const button = setup({ active: false });
    addFavorite.mockRejectedValue(new Error("Utilisateur non authentifié"));

    await act(async () => {
      fireEvent.click(button);
    });

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Utilisateur non authentifié"
    );
  });

  it("fait disparaître le message après 4 secondes", async () => {
    jest.useFakeTimers();
    const button = setup({ active: false });
    addFavorite.mockRejectedValue(new Error("Erreur API"));

    await act(async () => {
      fireEvent.click(button);
    });
    expect(screen.getByRole("alert")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
