import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Pokemon } from "@/types";
import { PokemonHero } from "./PokemonHero";

const back = vi.fn();

// Mock Next.js components
vi.mock("next/navigation", () => ({
  useRouter: () => ({ back }),
}));

vi.mock("next/image", () => ({
  default: function MockImage({ src, alt }: { src: string; alt: string }) {
    return <img src={src} alt={alt} />;
  },
}));

const charmander = {
  id: "4",
  name: "charmander",
  image: "https://example.com/4.png",
  type: ["Fire"],
} as Pokemon;

describe("PokemonHero", () => {
  beforeEach(() => {
    back.mockClear();
  });

  it("renders the name as the page heading", () => {
    render(<PokemonHero pokemon={charmander} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("charmander");
  });

  it("renders the zero-padded dex number", () => {
    render(<PokemonHero pokemon={charmander} />);

    expect(screen.getByText("#004")).toBeInTheDocument();
  });

  it("renders the artwork with the name as alt text", () => {
    render(<PokemonHero pokemon={charmander} />);

    expect(screen.getByAltText("charmander")).toHaveAttribute("src", charmander.image);
  });

  it("renders a pill for every type", () => {
    render(<PokemonHero pokemon={{ ...charmander, type: ["Grass", "Poison"] } as Pokemon} />);

    expect(screen.getByText("Grass")).toBeInTheDocument();
    expect(screen.getByText("Poison")).toBeInTheDocument();
  });

  it("navigates back when the toolbar button is clicked", async () => {
    const user = userEvent.setup();
    render(<PokemonHero pokemon={charmander} />);

    await user.click(screen.getByRole("button", { name: /back/i }));

    expect(back).toHaveBeenCalledTimes(1);
  });

  it("applies the caller's type class so the --type-* palette cascades in", () => {
    const { container } = render(<PokemonHero pokemon={charmander} className="type-fire" />);

    expect(container.firstChild).toHaveClass("type-fire");
  });

  it("stays an inset card by default", () => {
    const { container } = render(<PokemonHero pokemon={charmander} />);

    expect(container.querySelector("section")).not.toHaveClass("flush");
  });

  it("runs out to the container's edges when flush", () => {
    const { container } = render(<PokemonHero pokemon={charmander} flush />);

    expect(container.querySelector("section")).toHaveClass("flush");
  });
});
