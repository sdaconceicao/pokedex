import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SortSelect } from "./SortSelect";

describe("SortSelect", () => {
  it("offers the four sort orders", async () => {
    const user = userEvent.setup();
    render(<SortSelect value="ID_ASC" onChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox", { name: "Sort by" }));

    const listbox = await screen.findByRole("listbox");
    expect(within(listbox).getByRole("option", { name: "Dex number ↑" })).toBeInTheDocument();
    expect(within(listbox).getByRole("option", { name: "Dex number ↓" })).toBeInTheDocument();
    expect(within(listbox).getByRole("option", { name: "Name A–Z" })).toBeInTheDocument();
    expect(within(listbox).getByRole("option", { name: "Name Z–A" })).toBeInTheDocument();
  });

  it("shows the currently selected sort", () => {
    render(<SortSelect value="NAME_DESC" onChange={vi.fn()} />);

    expect(screen.getByRole("combobox", { name: "Sort by" })).toHaveValue("Name Z–A");
  });

  it("fires onChange with the picked sort", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SortSelect value="ID_ASC" onChange={onChange} />);

    await user.click(screen.getByRole("combobox", { name: "Sort by" }));
    await user.click(
      within(await screen.findByRole("listbox")).getByRole("option", { name: "Name A–Z" }),
    );

    expect(onChange).toHaveBeenCalledWith("NAME_ASC");
  });

  it("shows a visible label", () => {
    render(<SortSelect value="ID_ASC" onChange={vi.fn()} />);

    expect(screen.getByText("Sort by")).toBeInTheDocument();
  });
});
