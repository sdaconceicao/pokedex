import { render, screen } from "@testing-library/react";
import { HeroToolbar } from "./HeroToolbar";

const groups = (container: HTMLElement) => {
  const bar = container.querySelector(".bar");
  return { first: bar?.firstElementChild, last: bar?.lastElementChild };
};

describe("HeroToolbar", () => {
  it("renders the hero's title", () => {
    render(<HeroToolbar title="Kanto" />);

    expect(screen.getByText("Kanto")).toBeInTheDocument();
  });

  it("keeps the hero's actions reachable", () => {
    render(<HeroToolbar title="Bulbasaur" aside={<button type="button">Back</button>} />);

    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("puts the title on the right by default, the aside opposite it", () => {
    const { container } = render(
      <HeroToolbar title="Bulbasaur" aside={<button type="button">Back</button>} />,
    );

    const { first, last } = groups(container);
    expect(first).toContainElement(screen.getByRole("button", { name: "Back" }));
    expect(last).toContainElement(screen.getByText("Bulbasaur"));
  });

  it("moves the title to the left when asked, pushing the aside right", () => {
    const { container } = render(
      <HeroToolbar title="Kanto" titleSide="left" aside={<span>153 Pokemon</span>} />,
    );

    const { first, last } = groups(container);
    expect(first).toContainElement(screen.getByText("Kanto"));
    expect(last).toContainElement(screen.getByText("153 Pokemon"));
  });

  it("renders the artwork beside the title when there is any", () => {
    render(<HeroToolbar title="Bulbasaur" icon={<span data-testid="sprite" />} />);

    expect(screen.getByText("Bulbasaur").nextElementSibling).toBe(screen.getByTestId("sprite"));
  });

  it("renders with neither an aside nor artwork", () => {
    render(<HeroToolbar title="Johto" />);

    expect(screen.getByText("Johto")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("carries the caller's palette class so --type-* cascades in", () => {
    const { container } = render(<HeroToolbar title="Bulbasaur" className="type-grass" />);

    expect(container.firstChild).toHaveClass("type-grass");
  });

  it("keeps the bar inset by default", () => {
    const { container } = render(<HeroToolbar title="Kanto" />);

    expect(container.querySelector(".bar")).not.toHaveClass("flush");
  });

  it("spans the container's full width when flush", () => {
    const { container } = render(<HeroToolbar title="Kanto" flush />);

    expect(container.querySelector(".bar")).toHaveClass("flush");
  });
});
