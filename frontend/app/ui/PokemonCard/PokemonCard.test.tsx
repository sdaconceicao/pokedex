import { render, screen } from "@testing-library/react";
import { PokemonCard } from "./PokemonCard";
import { Pokemon } from "@/types/graphql";

// Mock the PokemonTypePill component
jest.mock("../PokemonTypePill", () => ({
  __esModule: true,
  default: ({ type }: { type: string }) => (
    <span data-testid={`type-pill-${type}`}>{type}</span>
  ),
}));

// Mock Next.js components
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock("next/image", () => {
  return function MockImage({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }) {
    return <img src={src} alt={alt} width={width} height={height} />;
  };
});

describe("PokemonCard", () => {
  const mockPokemon: Pokemon = {
    id: "1",
    name: "bulbasaur",
    image: "https://example.com/bulbasaur.jpg",
    type: ["grass", "poison"],
    abilitiesLite: [
      {
        id: "1",
        name: "overgrow",
        isHidden: false,
        slot: 1,
        url: "https://example.com/ability/1",
      },
    ],
    stats: {
      hp: 45,
      attack: 49,
      defense: 49,
      specialAttack: 65,
      specialDefense: 65,
      speed: 45,
    },
  };

  it("renders with required props", () => {
    render(<PokemonCard pokemon={mockPokemon} />);

    const card = screen.getByTestId("pokemon-card");
    expect(card).toBeInTheDocument();
  });

  it("displays Pokemon image with correct attributes", () => {
    render(<PokemonCard pokemon={mockPokemon} />);

    const image = screen.getByAltText("bulbasaur");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/bulbasaur.jpg");
    expect(image).toHaveAttribute("width", "239");
    expect(image).toHaveAttribute("height", "128");
  });

  it("displays formatted Pokemon name", () => {
    render(<PokemonCard pokemon={mockPokemon} />);

    const nameLink = screen.getByText("Bulbasaur");
    expect(nameLink).toBeInTheDocument();
    expect(nameLink.closest("a")).toHaveAttribute("href", "pokemon/1");
  });

  it("displays all Pokemon types", () => {
    render(<PokemonCard pokemon={mockPokemon} />);

    expect(screen.getByTestId("type-pill-grass")).toBeInTheDocument();
    expect(screen.getByTestId("type-pill-poison")).toBeInTheDocument();
  });

  it("displays Pokemon stats", () => {
    render(<PokemonCard pokemon={mockPokemon} />);

    expect(screen.getByText("HP: 45")).toBeInTheDocument();
    expect(screen.getByText("Attack: 49")).toBeInTheDocument();
    expect(screen.getByText("Defense: 49")).toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    render(<PokemonCard pokemon={mockPokemon} />);

    const card = screen.getByTestId("pokemon-card");
    expect(card).toHaveClass("pokemonCard");
    expect(card).toHaveClass("type-grass");
  });

  it("handles Pokemon with single type", () => {
    const singleTypePokemon: Pokemon = {
      ...mockPokemon,
      type: ["fire"],
    };

    render(<PokemonCard pokemon={singleTypePokemon} />);

    const card = screen.getByTestId("pokemon-card");
    expect(card).toHaveClass("type-fire");
  });

  it("handles Pokemon with empty type array", () => {
    const noTypePokemon: Pokemon = {
      ...mockPokemon,
      type: [],
    };

    render(<PokemonCard pokemon={noTypePokemon} />);

    const card = screen.getByTestId("pokemon-card");
    expect(card).toHaveClass("type-normal");
  });

  it("handles Pokemon with special characters in name", () => {
    const specialNamePokemon: Pokemon = {
      ...mockPokemon,
      name: "mr-mime",
    };

    render(<PokemonCard pokemon={specialNamePokemon} />);

    expect(screen.getByText("Mr-mime")).toBeInTheDocument();
  });

  it("handles Pokemon with uppercase name", () => {
    const uppercaseNamePokemon: Pokemon = {
      ...mockPokemon,
      name: "CHARIZARD",
    };

    render(<PokemonCard pokemon={uppercaseNamePokemon} />);

    expect(screen.getByText("CHARIZARD")).toBeInTheDocument();
  });

  it("applies correct CSS classes for different types", () => {
    const firePokemon: Pokemon = {
      ...mockPokemon,
      type: ["fire"],
    };

    render(<PokemonCard pokemon={firePokemon} />);

    const card = screen.getByTestId("pokemon-card");
    expect(card).toHaveClass("type-fire");
  });

  it("renders with correct data-testid", () => {
    render(<PokemonCard pokemon={mockPokemon} />);

    expect(screen.getByTestId("pokemon-card")).toBeInTheDocument();
  });
});
