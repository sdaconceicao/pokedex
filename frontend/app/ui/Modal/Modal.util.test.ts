import {
  isBackdropClick,
  getDialogClassName,
  shouldRenderModal,
} from "./Modal.utils";

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

  describe("getDialogClassName", () => {
    it("combines base class, size class, and custom class", () => {
      const result = getDialogClassName("dialog", "md", "custom-class");
      expect(result).toBe("dialog md custom-class");
    });

    it("handles empty custom class name", () => {
      const result = getDialogClassName("dialog", "lg", "");
      expect(result).toBe("dialog lg");
    });

    it("handles different sizes", () => {
      expect(getDialogClassName("dialog", "sm", "test")).toBe("dialog sm test");
      expect(getDialogClassName("dialog", "md", "test")).toBe("dialog md test");
      expect(getDialogClassName("dialog", "lg", "test")).toBe("dialog lg test");
      expect(getDialogClassName("dialog", "xl", "test")).toBe("dialog xl test");
    });

    it("trims whitespace from custom class name", () => {
      const result = getDialogClassName("dialog", "md", "  custom-class  ");
      expect(result).toBe("dialog md custom-class");
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
