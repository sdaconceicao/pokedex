import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { ListHeader } from "./ListHeader";

describe("ListHeader", () => {
  it("renders an h2 by default", () => {
    render(<ListHeader title="Kanto" sort="ID_ASC" onSortChange={vi.fn()} />);

    expect(screen.getByRole("heading", { level: 2, name: "Kanto" })).toBeInTheDocument();
  });

  it("renders an h1 when asked", () => {
    render(<ListHeader title="Filtered results" level={1} sort="ID_ASC" onSortChange={vi.fn()} />);

    expect(screen.getByRole("heading", { level: 1, name: "Filtered results" })).toBeInTheDocument();
  });

  it("lands the ref on the heading itself", () => {
    const ref = createRef<HTMLHeadingElement>();
    render(<ListHeader title="Kanto" sort="ID_ASC" onSortChange={vi.fn()} ref={ref} />);

    expect(ref.current).toBe(screen.getByRole("heading", { name: "Kanto" }));
  });

  it("offers the sort select beside the heading", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(<ListHeader title="Kanto" sort="ID_ASC" onSortChange={onSortChange} />);

    await user.click(screen.getByRole("combobox", { name: "Sort by" }));
    await user.click(
      within(await screen.findByRole("listbox")).getByRole("option", { name: "Name A–Z" }),
    );

    expect(onSortChange).toHaveBeenCalledWith("NAME_ASC");
  });
});
