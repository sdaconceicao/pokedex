import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Modal } from "./Modal";

// react-aria portals the dialog straight onto document.body, and there's no
// <dialog> element backing it any more, so every query below goes through
// role/name rather than a tag or a hand-rolled class the way the old
// hand-rolled <dialog> could be queried.
describe("Modal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: <div>Modal content</div>,
  };

  it("renders when open", () => {
    render(<Modal {...defaultProps} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<Modal {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
  });

  it("renders with title", () => {
    render(<Modal {...defaultProps} title="Test Modal" />);

    expect(screen.getByRole("heading", { name: "Test Modal" })).toBeInTheDocument();
  });

  it("renders a custom header in place of the title", () => {
    render(
      <Modal
        {...defaultProps}
        title="Ignored"
        header={<div data-testid="custom-header">Custom Header</div>}
      />,
    );

    expect(screen.getByTestId("custom-header")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Ignored" })).not.toBeInTheDocument();
  });

  it("renders with footer", () => {
    render(<Modal {...defaultProps} footer={<div data-testid="footer">Footer content</div>} />);

    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("shows close button by default", () => {
    render(<Modal {...defaultProps} />);

    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("hides close button when showCloseButton is false", () => {
    render(<Modal {...defaultProps} showCloseButton={false} />);

    expect(screen.queryByRole("button", { name: /close/i })).not.toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<Modal {...defaultProps} onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: /close/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on Escape by default", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<Modal {...defaultProps} onClose={onClose} />);
    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape even when closeOnBackdropClick is false — the two were never linked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<Modal {...defaultProps} onClose={onClose} closeOnBackdropClick={false} />);
    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on an outside click by default (closeOnBackdropClick defaults to true)", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<Modal {...defaultProps} onClose={onClose} />);
    await user.click(document.body);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose on an outside click when closeOnBackdropClick is false", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<Modal {...defaultProps} onClose={onClose} closeOnBackdropClick={false} />);
    await user.click(document.body);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("applies the size class to the modal, and swaps it out on rerender", () => {
    const { rerender } = render(<Modal {...defaultProps} size="sm" />);

    expect(document.querySelector(".sm")).toBeInTheDocument();

    rerender(<Modal {...defaultProps} size="lg" />);

    expect(document.querySelector(".sm")).not.toBeInTheDocument();
    expect(document.querySelector(".lg")).toBeInTheDocument();
  });

  it("applies a custom className alongside the size class", () => {
    render(<Modal {...defaultProps} className="custom-class" />);

    expect(document.querySelector(".custom-class")).toBeInTheDocument();
  });
});
