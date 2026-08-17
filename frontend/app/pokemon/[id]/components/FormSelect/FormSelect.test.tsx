import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { PokemonForm } from "@/types";
import { FormSelect } from "./FormSelect";

const replace = vi.fn();
let pathname = "/pokemon/25";
let search = "";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => pathname,
  useSearchParams: () => new URLSearchParams(search),
}));

const forms: PokemonForm[] = [
  {
    id: "25",
    name: "pikachu",
    image: "https://example.com/25.png",
    isDefault: true,
  },
  {
    id: "10199",
    name: "pikachu-gmax",
    image: "https://example.com/10199.png",
    isDefault: false,
  },
];

const renderSelect = (props: Partial<React.ComponentProps<typeof FormSelect>> = {}) =>
  render(
    <FormSelect forms={forms} currentId="25" speciesId="25" speciesName="pikachu" {...props} />,
  );

const open = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("combobox", { name: "Form" }));
  return screen.findByRole("listbox");
};

describe("FormSelect", () => {
  beforeEach(() => {
    replace.mockClear();
    pathname = "/pokemon/25";
    search = "";
  });

  it("renders nothing when the Pokemon has no alternate form", () => {
    const { container } = renderSelect({ forms: [forms[0]] });

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing for a Pokemon that carries no forms at all", () => {
    const { container } = renderSelect({ forms: undefined });

    expect(container).toBeEmptyDOMElement();
  });

  it("offers an option per form, named by the form alone", async () => {
    const user = userEvent.setup();
    renderSelect();

    const listbox = await open(user);
    expect(within(listbox).getByRole("option", { name: "Default" })).toBeInTheDocument();
    expect(within(listbox).getByRole("option", { name: "Gigantamax" })).toBeInTheDocument();
  });

  it("shows a sprite beside each option", async () => {
    const user = userEvent.setup();
    renderSelect();

    const listbox = await open(user);
    const gmax = within(listbox).getByRole("option", { name: "Gigantamax" });

    expect(gmax.querySelector("img")).toHaveAttribute("src", "https://example.com/10199.png");
  });

  it("starts on the form being displayed", () => {
    renderSelect();

    expect(screen.getByRole("combobox", { name: "Form" })).toHaveValue("Default");
  });

  it("starts on the alternate form when that is the page", () => {
    renderSelect({ currentId: "10199" });

    expect(screen.getByRole("combobox", { name: "Form" })).toHaveValue("Gigantamax");
  });

  it("routes to the picked form", async () => {
    const user = userEvent.setup();
    renderSelect();

    const listbox = await open(user);
    await user.click(within(listbox).getByRole("option", { name: "Gigantamax" }));

    expect(replace).toHaveBeenCalledWith("/pokemon/25/forms/10199", { scroll: false });
  });

  it("routes back to the species when the default is picked", async () => {
    pathname = "/pokemon/25/forms/10199";

    const user = userEvent.setup();
    renderSelect({ currentId: "10199" });

    const listbox = await open(user);
    await user.click(within(listbox).getByRole("option", { name: "Default" }));

    expect(replace).toHaveBeenCalledWith("/pokemon/25", { scroll: false });
  });

  it("stays in the modal it was opened from, keeping the list's page and sort", async () => {
    pathname = "/region/kanto/pokemon/25";
    search = "page=2&sort=NAME_ASC";

    const user = userEvent.setup();
    renderSelect();

    const listbox = await open(user);
    await user.click(within(listbox).getByRole("option", { name: "Gigantamax" }));

    expect(replace).toHaveBeenCalledWith(
      "/region/kanto/pokemon/25/forms/10199?page=2&sort=NAME_ASC",
      { scroll: false },
    );
  });

  it("does not navigate when the form already shown is picked again", async () => {
    const user = userEvent.setup();
    renderSelect();

    const listbox = await open(user);
    await user.click(within(listbox).getByRole("option", { name: "Default" }));

    expect(replace).not.toHaveBeenCalled();
  });

  it("shows a visible label", () => {
    renderSelect();

    expect(screen.getByText("Form")).toBeInTheDocument();
  });
});
