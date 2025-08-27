import { isBackdropClick, shouldRenderModal } from "./Modal.utils";

describe("Modal utilities", () => {
  describe("isBackdropClick", () => {
    it("returns true when click is outside dialog bounds", () => {
      const mockEvent = {
        currentTarget: {
          getBoundingClientRect: () => ({
            left: 0,
            right: 100,
            top: 0,
            bottom: 100,
          }),
        },
        clientX: 150, // Outside the dialog
        clientY: 150,
      } as React.MouseEvent<HTMLDialogElement>;

      const result = isBackdropClick(mockEvent);
      expect(result).toBe(true);
    });

    it("returns false when click is inside dialog bounds", () => {
      const mockEvent = {
        currentTarget: {
          getBoundingClientRect: () => ({
            left: 0,
            right: 100,
            top: 0,
            bottom: 100,
          }),
        },
        clientX: 50, // Inside the dialog
        clientY: 50,
      } as React.MouseEvent<HTMLDialogElement>;

      const result = isBackdropClick(mockEvent);
      expect(result).toBe(false);
    });

    it("returns false when click is exactly on dialog boundary", () => {
      const mockEvent = {
        currentTarget: {
          getBoundingClientRect: () => ({
            left: 0,
            right: 100,
            top: 0,
            bottom: 100,
          }),
        },
        clientX: 100, // On the right boundary
        clientY: 50,
      } as React.MouseEvent<HTMLDialogElement>;

      const result = isBackdropClick(mockEvent);
      expect(result).toBe(false);
    });
  });

  describe("shouldRenderModal", () => {
    it("returns true when isOpen is true", () => {
      expect(shouldRenderModal(true)).toBe(true);
    });

    it("returns false when isOpen is false", () => {
      expect(shouldRenderModal(false)).toBe(false);
    });
  });
});
