import { fireEvent, render, screen } from "@testing-library/react";
import Carousel from "@/components/LogementDetails/Carousel/Carousel";

// On remplace next/image par une simple balise <img>
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: ({ fill, priority, ...props }) => <img {...props} />,
}));

const PICTURES = ["/a.jpg", "/b.jpg", "/c.jpg"];

describe("Carousel", () => {
  it("ne rend rien s'il n'y a aucune image", () => {
    const { container } = render(<Carousel pictures={[]} title="Logement" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("utilise la cover si pictures est vide", () => {
    const { container } = render(
      <Carousel pictures={[]} cover="/cover.jpg" title="Logement" />
    );
    const images = container.querySelectorAll("img");
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveAttribute("src", "/cover.jpg");
  });

  it("n'affiche pas les flèches ni le compteur s'il n'y a qu'une seule image", () => {
    render(<Carousel pictures={["/solo.jpg"]} title="Logement" />);

    expect(screen.queryByLabelText("Image précédente")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Image suivante")).not.toBeInTheDocument();
    expect(screen.queryByText(/\d+ \/ \d+/)).not.toBeInTheDocument();
  });

  it("affiche les flèches et le compteur quand il y a plusieurs images", () => {
    render(<Carousel pictures={PICTURES} title="Logement" />);

    expect(screen.getByLabelText("Image précédente")).toBeInTheDocument();
    expect(screen.getByLabelText("Image suivante")).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("passe à l'image suivante au clic sur la flèche de droite", () => {
    render(<Carousel pictures={PICTURES} title="Logement" />);

    fireEvent.click(screen.getByLabelText("Image suivante"));

    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("revient à la dernière image au clic sur la flèche de gauche depuis la première", () => {
    render(<Carousel pictures={PICTURES} title="Logement" />);

    fireEvent.click(screen.getByLabelText("Image précédente"));

    expect(screen.getByText("3 / 3")).toBeInTheDocument();
  });

  it("change d'image avec la touche flèche droite du clavier", () => {
    render(<Carousel pictures={PICTURES} title="Logement" />);

    fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowRight" });

    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });
});
