import { render, screen } from "@testing-library/react";
import { HeroToolbar } from "./HeroToolbar";

describe("HeroToolbar", () => {
  it("renders the hero's title", () => {
    render(<HeroToolbar title="Kanto" />);

    expect(screen.getByText("Kanto")).toBeInTheDocument();
  });

  it("keeps the hero's actions reachable", () => {
    render(<HeroToolbar title="Bulbasaur" actions={<button type="button">Back</button>} />);

    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("puts the actions before the title, so they sit on opposite sides", () => {
    const { container } = render(
      <HeroToolbar title="Bulbasaur" actions={<button type="button">Back</button>} />,
    );

    const bar = container.querySelector(".bar");
    expect(bar?.firstElementChild).toContainElement(screen.getByRole("button", { name: "Back" }));
    expect(bar?.lastElementChild).toContainElement(screen.getByText("Bulbasaur"));
  });

  it("renders the artwork beside the title when there is any", () => {
    render(<HeroToolbar title="Bulbasaur" icon={<span data-testid="sprite" />} />);

    expect(screen.getByText("Bulbasaur").nextElementSibling).toBe(screen.getByTestId("sprite"));
  });

  it("renders without actions or artwork, as the region uses it", () => {
    render(<HeroToolbar title="Johto" />);

    expect(screen.getByText("Johto")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("carries the caller's palette class so --type-* cascades in", () => {
    const { container } = render(<HeroToolbar title="Bulbasaur" className="type-grass" />);

    expect(container.firstChild).toHaveClass("type-grass");
  });
});
