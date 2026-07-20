import { render, screen } from "@testing-library/react";
import type { EvolutionChain, EvolutionNode } from "@/types/graphql";
import { PokemonEvolution } from "./PokemonEvolution";

// Mock Next.js components
vi.mock("next/link", () => ({
  default: function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  },
}));

vi.mock("next/image", () => ({
  default: function MockImage({ src, alt }: { src: string; alt: string }) {
    return <img src={src} alt={alt} />;
  },
}));

const makeNode = (overrides: Partial<EvolutionNode>): EvolutionNode => ({
  id: "1",
  name: "bulbasaur",
  image: "https://example.com/1.png",
  minLevel: null,
  trigger: null,
  item: null,
  evolvesTo: [],
  ...overrides,
});

// Mirrors the deepest node the GraphQL query returns: the query stops selecting
// children at that depth, so `evolvesTo` is absent (undefined), not [].
const makeLeafNode = (overrides: Partial<EvolutionNode>): EvolutionNode => {
  const node = makeNode(overrides);
  delete (node as { evolvesTo?: unknown }).evolvesTo;
  return node;
};

// bulbasaur -> ivysaur (Lv.16) -> venusaur (Lv.32)
const linearChain: EvolutionChain = {
  id: "1",
  chain: makeNode({
    id: "1",
    name: "bulbasaur",
    evolvesTo: [
      makeNode({
        id: "2",
        name: "ivysaur",
        image: "https://example.com/2.png",
        minLevel: 16,
        trigger: "level-up",
        evolvesTo: [
          makeLeafNode({
            id: "3",
            name: "venusaur",
            image: "https://example.com/3.png",
            minLevel: 32,
            trigger: "level-up",
          }),
        ],
      }),
    ],
  }),
};

describe("PokemonEvolution", () => {
  it("renders every Pokemon in a linear chain", () => {
    render(<PokemonEvolution evolution={linearChain} currentId="2" />);

    expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("Ivysaur")).toBeInTheDocument();
    expect(screen.getByText("Venusaur")).toBeInTheDocument();
  });

  it("links to other Pokemon but not the current one", () => {
    render(<PokemonEvolution evolution={linearChain} currentId="2" />);

    // Other stages link to their detail pages
    expect(screen.getByText("Bulbasaur").closest("a")).toHaveAttribute("href", "/pokemon/1");
    expect(screen.getByText("Venusaur").closest("a")).toHaveAttribute("href", "/pokemon/3");

    // The current Pokemon is highlighted, not a link
    const current = screen.getByText("Ivysaur").closest("a");
    expect(current).toBeNull();
    expect(screen.getByText("Ivysaur").closest('[aria-current="page"]')).not.toBeNull();
  });

  it("shows the evolution conditions between stages", () => {
    render(<PokemonEvolution evolution={linearChain} currentId="1" />);

    expect(screen.getByText("Lv. 16")).toBeInTheDocument();
    expect(screen.getByText("Lv. 32")).toBeInTheDocument();
  });

  it("does not crash when the deepest node has no evolvesTo field", () => {
    // The query only selects evolvesTo a few levels deep, so the final stage
    // arrives with evolvesTo undefined rather than an empty array. The final
    // stage (venusaur in linearChain) is built with makeLeafNode to match.
    expect(() => render(<PokemonEvolution evolution={linearChain} currentId="1" />)).not.toThrow();
    expect(screen.getByText("Venusaur")).toBeInTheDocument();
  });

  it("renders every branch of a branching chain with item conditions", () => {
    const branchingChain: EvolutionChain = {
      id: "67",
      chain: makeNode({
        id: "133",
        name: "eevee",
        image: "https://example.com/133.png",
        evolvesTo: [
          makeNode({
            id: "134",
            name: "vaporeon",
            image: "https://example.com/134.png",
            trigger: "use-item",
            item: "water-stone",
          }),
          makeNode({
            id: "135",
            name: "jolteon",
            image: "https://example.com/135.png",
            trigger: "use-item",
            item: "thunder-stone",
          }),
        ],
      }),
    };

    render(<PokemonEvolution evolution={branchingChain} currentId="133" />);

    expect(screen.getByText("Eevee")).toBeInTheDocument();
    expect(screen.getByText("Vaporeon")).toBeInTheDocument();
    expect(screen.getByText("Jolteon")).toBeInTheDocument();
    expect(screen.getByText("Use Water Stone")).toBeInTheDocument();
    expect(screen.getByText("Use Thunder Stone")).toBeInTheDocument();
  });

  it("shows no 'does not evolve' message (the section is hidden instead)", () => {
    const singleChain: EvolutionChain = {
      id: "132",
      chain: makeNode({ id: "132", name: "ditto", image: "https://example.com/132.png" }),
    };

    render(<PokemonEvolution evolution={singleChain} currentId="132" />);

    expect(screen.getByText("Ditto")).toBeInTheDocument();
    expect(screen.queryByText("This Pokémon does not evolve.")).not.toBeInTheDocument();
  });
});
