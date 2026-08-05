import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegionPokemonModal from "./RegionPokemonModal";

const replace = vi.fn();
let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  useParams: () => ({ name: "kanto" }),
  useSearchParams: () => searchParams,
}));

// jsdom has no dialog.showModal, so the open/close effects are stubbed the way
// Modal's own tests do it. The dialog therefore never gets its `open`
// attribute, which is why the queries below have to look at hidden nodes.
vi.mock("@/components/Modal/Modal.hooks", () => ({
  useModal: () => ({ dialogRef: { current: null }, handleClose: vi.fn() }),
}));

const closeButton = () => screen.getByRole("button", { name: /close modal/i, hidden: true });

describe("RegionPokemonModal", () => {
  beforeEach(() => {
    replace.mockClear();
    searchParams = new URLSearchParams();
  });

  it("renders the detail it is handed", () => {
    render(
      <RegionPokemonModal>
        <p>Charmander</p>
      </RegionPokemonModal>,
    );

    expect(screen.getByText("Charmander")).toBeInTheDocument();
  });

  it("closes to the region, keeping the page it was opened from", async () => {
    const user = userEvent.setup();
    searchParams = new URLSearchParams("page=2");
    render(
      <RegionPokemonModal>
        <p>Charmander</p>
      </RegionPokemonModal>,
    );

    await user.click(closeButton());

    expect(replace).toHaveBeenCalledWith("/region/kanto?page=2", { scroll: false });
  });

  it("closes to the bare region URL from the first page", async () => {
    const user = userEvent.setup();
    render(
      <RegionPokemonModal>
        <p>Charmander</p>
      </RegionPokemonModal>,
    );

    await user.click(closeButton());

    expect(replace).toHaveBeenCalledWith("/region/kanto", { scroll: false });
  });
});
