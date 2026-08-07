import { render, screen } from "@testing-library/react";
import type { TypeDetail } from "@/types";
import { TypeHero } from "./TypeHero";

vi.mock("next/image", () => ({
  default: function MockImage({ src, alt }: { src: string; alt: string }) {
    return <img src={src} alt={alt} />;
  },
}));

const fire: TypeDetail = {
  id: "10",
  name: "fire",
  displayName: "Fire",
  generation: "generation-i",
  sprite: "https://example.com/fire.png",
  pokemonCount: 109,
  moveCount: 47,
  damageRelations: {
    doubleDamageTo: ["grass", "ice"],
    halfDamageTo: ["water"],
    noDamageTo: [],
    doubleDamageFrom: ["ground"],
    halfDamageFrom: ["fairy"],
    noDamageFrom: [],
  },
};

describe("TypeHero", () => {
  it("renders the type name as the page heading", () => {
    render(<TypeHero type={fire} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Fire");
  });

  it("renders the formatted generation", () => {
    render(<TypeHero type={fire} />);

    expect(screen.getByText("Generation I")).toBeInTheDocument();
  });

  it("counts the type's Pokemon and moves", () => {
    render(<TypeHero type={fire} />);

    expect(screen.getByText("Pokemon").nextSibling).toHaveTextContent("109");
    expect(screen.getByText("Moves").nextSibling).toHaveTextContent("47");
  });

  it("renders the type's own sprite", () => {
    render(<TypeHero type={fire} />);

    expect(screen.getByAltText("Fire type")).toHaveAttribute("src", fire.sprite);
  });

  it("renders without a sprite when the API has none", () => {
    render(<TypeHero type={{ ...fire, sprite: null }} />);

    expect(screen.queryByAltText("Fire type")).toBeNull();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Fire");
  });

  it("tints itself with the type's palette", () => {
    const { container } = render(<TypeHero type={fire} />);

    expect(container.querySelector("section")).toHaveClass("type-fire");
  });

  it("charts what the type is strong and weak against", () => {
    render(<TypeHero type={fire} />);

    expect(screen.getByText("Strong against")).toBeInTheDocument();
    expect(screen.getByText("Weak to")).toBeInTheDocument();
    expect(screen.getByText("grass")).toBeInTheDocument();
    expect(screen.getByText("ground")).toBeInTheDocument();
  });

  it("leaves out matchup rows the API returned empty", () => {
    render(<TypeHero type={fire} />);

    expect(screen.queryByText("No effect on")).toBeNull();
    expect(screen.queryByText("Immune to")).toBeNull();
  });
});
