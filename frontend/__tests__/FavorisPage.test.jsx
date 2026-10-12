import { render, screen, waitFor } from "@testing-library/react";
import FavorisPage from "@/app/favoris/page";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { getFavorites } from "@/services/favoriteServices";

jest.mock("@/context/AuthContext", () => ({ useAuth: jest.fn() }));
jest.mock("@/context/FavoritesContext", () => ({ useFavorites: jest.fn() }));
jest.mock("@/services/favoriteServices", () => ({ getFavorites: jest.fn() }));
// La carte n'est pas l'objet de ce test : on la remplace par un simple titre
jest.mock("@/components/LogementCard/LogementCard", () => ({
  __esModule: true,
  default: ({ logement }) => <div data-testid="card">{logement.title}</div>,
}));

const COSY = { id: "a", title: "Appartement cosy" };
const STUDIO = { id: "b", title: "Studio de charme" };

let consoleErrorSpy;

beforeEach(() => {
  jest.resetAllMocks();
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  useAuth.mockReturnValue({ user: { id: 14 }, loading: false });
  useFavorites.mockReturnValue({ isFavorite: () => true, ready: true });
  getFavorites.mockResolvedValue([COSY, STUDIO]);
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
});

describe("FavorisPage", () => {
  it("affiche le titre de la page", async () => {
    render(<FavorisPage />);

    expect(
      screen.getByRole("heading", { name: "Vos favoris" })
    ).toBeInTheDocument();
    await screen.findAllByTestId("card");
  });

  it("charge puis affiche les favoris de l'utilisateur", async () => {
    render(<FavorisPage />);

    const cards = await screen.findAllByTestId("card");

    expect(getFavorites).toHaveBeenCalledWith(14);
    expect(cards).toHaveLength(2);
    expect(screen.getByText("Appartement cosy")).toBeInTheDocument();
    expect(screen.getByText("Studio de charme")).toBeInTheDocument();
  });

  it("n'affiche que les logements encore en favoris dans le Context", async () => {
    useFavorites.mockReturnValue({
      isFavorite: (id) => id === "a",
      ready: true,
    });

    render(<FavorisPage />);

    const cards = await screen.findAllByTestId("card");
    expect(cards).toHaveLength(1);
    expect(screen.getByText("Appartement cosy")).toBeInTheDocument();
    expect(screen.queryByText("Studio de charme")).not.toBeInTheDocument();
  });

  it("affiche un message quand il n'y a aucun favori", async () => {
    getFavorites.mockResolvedValue([]);

    render(<FavorisPage />);

    expect(
      await screen.findByText(/pas encore de favoris/i)
    ).toBeInTheDocument();
  });

  it("invite à se connecter quand personne n'est connecté", async () => {
    useAuth.mockReturnValue({ user: null, loading: false });

    render(<FavorisPage />);

    expect(
      await screen.findByText(/Connectez-vous pour retrouver vos favoris/i)
    ).toBeInTheDocument();
    expect(getFavorites).not.toHaveBeenCalled();
  });

  it("affiche le message d'erreur renvoyé par l'API", async () => {
    getFavorites.mockRejectedValue(new Error("Service indisponible"));

    render(<FavorisPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Service indisponible"
    );
  });

  it("affiche le chargement tant que l'authentification n'est pas prête", () => {
    useAuth.mockReturnValue({ user: null, loading: true });

    render(<FavorisPage />);

    expect(screen.getByText(/Chargement de vos favoris/i)).toBeInTheDocument();
    expect(getFavorites).not.toHaveBeenCalled();
  });

  it("attend que le Context soit prêt avant d'afficher la liste", async () => {
    useFavorites.mockReturnValue({ isFavorite: () => true, ready: false });

    render(<FavorisPage />);

    await waitFor(() => expect(getFavorites).toHaveBeenCalled());
    expect(screen.getByText(/Chargement de vos favoris/i)).toBeInTheDocument();
    expect(screen.queryByTestId("card")).not.toBeInTheDocument();
  });
});
