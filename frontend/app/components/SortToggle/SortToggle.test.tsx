import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { PokemonSort } from "@/types";
import { SortToggle } from "./SortToggle";

describe("SortToggle", () => {
  it("renders the field and direction groups, each with their two choices", () => {
    render(<SortToggle value="ID_ASC" onChange={vi.fn()} />);

    const field = screen.getByRole("radiogroup", { name: "Sort field" });
    expect(within(field).getByRole("radio", { name: "Dex number" })).toBeInTheDocument();
    expect(within(field).getByRole("radio", { name: "Name" })).toBeInTheDocument();

    const direction = screen.getByRole("radiogroup", { name: "Sort direction" });
    expect(within(direction).getByRole("radio", { name: "Ascending" })).toBeInTheDocument();
    expect(within(direction).getByRole("radio", { name: "Descending" })).toBeInTheDocument();
  });

  it.each([
    ["ID_ASC", "Dex number", "Ascending"],
    ["ID_DESC", "Dex number", "Descending"],
    ["NAME_ASC", "Name", "Ascending"],
    ["NAME_DESC", "Name", "Descending"],
  ] as const)("reflects %s as %s + %s pressed", (value, field, direction) => {
    render(<SortToggle value={value} onChange={vi.fn()} />);

    expect(screen.getByRole("radio", { name: field })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: direction })).toHaveAttribute("aria-checked", "true");
  });

  it("emits the field flipped, direction kept, when a field choice is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SortToggle value="NAME_ASC" onChange={onChange} />);

    await user.click(screen.getByRole("radio", { name: "Dex number" }));

    expect(onChange).toHaveBeenCalledWith("ID_ASC" satisfies PokemonSort);
  });

  it("emits the direction flipped, field kept, when a direction choice is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SortToggle value="NAME_ASC" onChange={onChange} />);

    await user.click(screen.getByRole("radio", { name: "Descending" }));

    expect(onChange).toHaveBeenCalledWith("NAME_DESC" satisfies PokemonSort);
  });
});
