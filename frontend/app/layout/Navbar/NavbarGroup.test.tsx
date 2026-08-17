import { render, screen } from "@testing-library/react";
import NavbarGroup from "./NavbarGroup";

describe("NavbarGroup", () => {
  it("renders its title as the section's heading", () => {
    render(<NavbarGroup title="Browse">links</NavbarGroup>);

    expect(screen.getByRole("heading", { name: "Browse" })).toBeInTheDocument();
  });

  it("labels the section with that heading, so it is announced as a group", () => {
    render(<NavbarGroup title="Search">form</NavbarGroup>);

    expect(screen.getByRole("region", { name: "Search" })).toBeInTheDocument();
  });

  it("gives a multi-word title a usable id", () => {
    render(<NavbarGroup title="Browse By Type">links</NavbarGroup>);

    expect(screen.getByRole("heading", { name: "Browse By Type" })).toHaveAttribute(
      "id",
      "navbar-group-browse-by-type",
    );
  });

  it("renders its children", () => {
    render(
      <NavbarGroup title="Browse">
        <a href="/type/fire">Fire</a>
      </NavbarGroup>,
    );

    expect(screen.getByRole("link", { name: "Fire" })).toBeInTheDocument();
  });
});
