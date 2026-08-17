import { render, screen } from "@testing-library/react";
import type { TypeDetail } from "@/types";
import { TypeHero } from "./TypeHero";

vi.mock("next/image", () => ({
  default: function MockImage({ src, alt }: { src: string; alt: string }) {
    return <img src={src} alt={alt} />;
  },
}));

// useSortParam reads the sort out of the URL via this hook
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
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

  it("charts the type's advantages on a wheel, its icon at the centre", () => {
    render(<TypeHero type={fire} />);

    expect(screen.getByTestId("type-wheel-core").querySelector("svg")).toBeInTheDocument();
    // One slice per type, whether or not the API had a sprite
    expect(screen.getAllByRole("button")).toHaveLength(18);
  });

  it("renders when the API has no sprite for the type", () => {
    render(<TypeHero type={{ ...fire, sprite: null }} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Fire");
    expect(screen.getAllByRole("button")).toHaveLength(18);
  });

  it("tints itself with the type's palette", () => {
    const { container } = render(<TypeHero type={fire} />);

    expect(container.querySelector("section")).toHaveClass("type-fire");
  });
});
