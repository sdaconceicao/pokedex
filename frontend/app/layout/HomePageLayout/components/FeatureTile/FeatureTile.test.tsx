import { render, screen } from "@testing-library/react";
import { FeatureTile } from "./FeatureTile";

describe("FeatureTile", () => {
  it("renders the title and body copy", () => {
    render(
      <FeatureTile
        icon={<svg data-testid="icon" />}
        accent="red"
        title="Search instantly"
        body="Type a name to jump straight to any Pokémon."
      />,
    );

    expect(screen.getByRole("heading", { name: "Search instantly" })).toBeInTheDocument();
    expect(screen.getByText("Type a name to jump straight to any Pokémon.")).toBeInTheDocument();
  });

  it("renders the provided icon", () => {
    render(
      <FeatureTile icon={<svg data-testid="icon" />} accent="blue" title="Title" body="Body" />,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
