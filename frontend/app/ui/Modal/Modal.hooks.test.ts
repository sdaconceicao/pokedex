import { renderHook, act } from "@testing-library/react";
import { useModal } from "./Modal.hooks";

describe("useModal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with correct return values", () => {
    const { result } = renderHook(() => useModal(true, mockOnClose));

    expect(result.current.dialogRef).toBeDefined();
    expect(result.current.handleClose).toBeDefined();
    expect(typeof result.current.handleClose).toBe("function");
  });

  it("calls handleClose when handleClose is invoked", () => {
    const { result } = renderHook(() => useModal(true, mockOnClose));

    act(() => {
      result.current.handleClose();
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when escape key is pressed", () => {
    renderHook(() => useModal(true, mockOnClose));

    // Simulate escape key press
    const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
    act(() => {
      document.dispatchEvent(escapeEvent);
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when other keys are pressed", () => {
    renderHook(() => useModal(true, mockOnClose));

    // Simulate other key press
    const otherKeyEvent = new KeyboardEvent("keydown", { key: "Enter" });
    act(() => {
      document.dispatchEvent(otherKeyEvent);
    });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("does not call onClose when escape is pressed and modal is closed", () => {
    renderHook(() => useModal(false, mockOnClose));

    // Simulate escape key press
    const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
    act(() => {
      document.dispatchEvent(escapeEvent);
    });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("removes event listener on cleanup", () => {
    const removeEventListenerSpy = jest.spyOn(document, "removeEventListener");
    const { unmount } = renderHook(() => useModal(true, mockOnClose));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
    removeEventListenerSpy.mockRestore();
  });

  it("handles multiple modal instances correctly", () => {
    const onClose1 = jest.fn();
    const onClose2 = jest.fn();

    const { result: result1 } = renderHook(() => useModal(true, onClose1));
    const { result: result2 } = renderHook(() => useModal(false, onClose2));

    expect(result1.current.dialogRef).toBeDefined();
    expect(result2.current.dialogRef).toBeDefined();

    act(() => {
      result1.current.handleClose();
    });

    expect(onClose1).toHaveBeenCalledTimes(1);
    expect(onClose2).not.toHaveBeenCalled();
  });
});
