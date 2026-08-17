import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RouteModal from "./RouteModal";

const replace = vi.fn();
const back = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, back }),
}));

const closeButton = () => screen.getByRole("button", { name: /close/i });

describe("RouteModal", () => {
  beforeEach(() => {
    replace.mockClear();
    back.mockClear();
  });

  it("renders the content it is handed", () => {
    render(
      <RouteModal>
        <p>Charmander</p>
      </RouteModal>,
    );

    expect(screen.getByText("Charmander")).toBeInTheDocument();
  });

  it("closes to closeHref without stacking it in history", async () => {
    const user = userEvent.setup();
    render(
      <RouteModal closeHref="/region/kanto?page=2">
        <p>Charmander</p>
      </RouteModal>,
    );

    await user.click(closeButton());

    expect(replace).toHaveBeenCalledWith("/region/kanto?page=2", { scroll: false });
    expect(back).not.toHaveBeenCalled();
  });

  it("drops the header along with the close button when asked", () => {
    render(
      <RouteModal showCloseButton={false}>
        <p>Charmander</p>
      </RouteModal>,
    );

    expect(screen.queryByRole("button", { name: /close/i })).toBeNull();
    expect(screen.getByText("Charmander")).toBeInTheDocument();
  });

  it("steps back through history when given no closeHref", async () => {
    const user = userEvent.setup();
    render(
      <RouteModal>
        <p>Charmander</p>
      </RouteModal>,
    );

    await user.click(closeButton());

    expect(back).toHaveBeenCalledTimes(1);
    expect(replace).not.toHaveBeenCalled();
  });
});
