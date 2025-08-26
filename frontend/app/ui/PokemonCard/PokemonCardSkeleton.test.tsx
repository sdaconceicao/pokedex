import { render, screen } from "@testing-library/react";
import { PokemonCardSkeleton } from "./PokemonCardSkeleton";

describe("PokemonCardSkeleton", () => {
  it("renders skeleton elements", () => {
    render(<PokemonCardSkeleton />);

    const skeleton = screen.getByTestId("pokemon-card-skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    render(<PokemonCardSkeleton />);

    const skeleton = screen.getByTestId("pokemon-card-skeleton");
    expect(skeleton).toHaveClass("pokemonCard");

    const imageSkeleton = skeleton.querySelector(".pokemonImage.skeletonImage");
    expect(imageSkeleton).toBeInTheDocument();

    const nameSkeleton = skeleton.querySelector(".pokemonName.skeletonName");
    expect(nameSkeleton).toBeInTheDocument();

    const typeList = skeleton.querySelector(".typeList");
    expect(typeList).toBeInTheDocument();

    const stats = skeleton.querySelector(".stats");
    expect(stats).toBeInTheDocument();
  });

  it("renders skeleton type pills", () => {
    render(<PokemonCardSkeleton />);

    const skeleton = screen.getByTestId("pokemon-card-skeleton");

    const type1 = skeleton.querySelector(".skeletonType.skeletonType1");
    expect(type1).toBeInTheDocument();

    const type2 = skeleton.querySelector(".skeletonType.skeletonType2");
    expect(type2).toBeInTheDocument();
  });

  it("renders skeleton stats", () => {
    render(<PokemonCardSkeleton />);

    const skeleton = screen.getByTestId("pokemon-card-skeleton");

    const stats = skeleton.querySelectorAll(".skeletonStat");
    expect(stats).toHaveLength(2);

    const lastStat = skeleton.querySelector(".skeletonStatLast");
    expect(lastStat).toBeInTheDocument();
  });

  it("has correct data-testid", () => {
    render(<PokemonCardSkeleton />);

    expect(screen.getByTestId("pokemon-card-skeleton")).toBeInTheDocument();
  });
});
