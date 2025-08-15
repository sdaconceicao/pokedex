import {
  getTotalPages,
  getStartItem,
  getEndItem,
  getPageNumbers,
} from "./Pagination.util";

describe("Pagination Utilities", () => {
  describe("getTotalPages", () => {
    it("should calculate total pages correctly for exact division", () => {
      expect(getTotalPages(100, 10)).toBe(10);
      expect(getTotalPages(50, 5)).toBe(10);
      expect(getTotalPages(25, 5)).toBe(5);
    });

    it("should round up for partial divisions", () => {
      expect(getTotalPages(101, 10)).toBe(11);
      expect(getTotalPages(99, 10)).toBe(10);
      expect(getTotalPages(1, 10)).toBe(1);
    });

    it("should handle edge cases", () => {
      expect(getTotalPages(0, 10)).toBe(0);
      expect(getTotalPages(10, 0)).toBe(Infinity);
      expect(getTotalPages(0, 0)).toBe(NaN);
    });
  });

  describe("getStartItem", () => {
    it("should calculate start item correctly for first page", () => {
      expect(getStartItem(1, 10)).toBe(1);
      expect(getStartItem(1, 5)).toBe(1);
      expect(getStartItem(1, 20)).toBe(1);
    });

    it("should calculate start item correctly for subsequent pages", () => {
      expect(getStartItem(2, 10)).toBe(11);
      expect(getStartItem(3, 10)).toBe(21);
      expect(getStartItem(5, 5)).toBe(21);
    });

    it("should handle edge cases", () => {
      expect(getStartItem(0, 10)).toBe(-9);
      expect(getStartItem(1, 0)).toBe(1);
    });
  });

  describe("getEndItem", () => {
    it("should calculate end item correctly for full pages", () => {
      expect(getEndItem(1, 10, 100)).toBe(10);
      expect(getEndItem(2, 10, 100)).toBe(20);
      expect(getEndItem(5, 5, 100)).toBe(25);
    });

    it("should handle last page correctly", () => {
      expect(getEndItem(10, 10, 95)).toBe(95);
      expect(getEndItem(3, 10, 25)).toBe(25);
      expect(getEndItem(5, 5, 23)).toBe(23);
    });

    it("should handle edge cases", () => {
      expect(getEndItem(1, 10, 0)).toBe(0);
      expect(getEndItem(0, 10, 100)).toBe(0);
    });
  });

  describe("getPageNumbers", () => {
    describe("when total pages <= 5", () => {
      it("should show all pages for 1 page", () => {
        expect(getPageNumbers(1, 1)).toEqual([1]);
      });

      it("should show all pages for 3 pages", () => {
        expect(getPageNumbers(2, 3)).toEqual([1, 2, 3]);
      });

      it("should show all pages for 5 pages", () => {
        expect(getPageNumbers(3, 5)).toEqual([1, 2, 3, 4, 5]);
      });
    });

    describe("when current page is near the beginning (<= 3)", () => {
      it("should show first 4 pages, ellipsis, and last page", () => {
        expect(getPageNumbers(1, 10)).toEqual([1, 2, 3, 4, "...", 10]);
        expect(getPageNumbers(2, 10)).toEqual([1, 2, 3, 4, "...", 10]);
        expect(getPageNumbers(3, 10)).toEqual([1, 2, 3, 4, "...", 10]);
      });

      it("should work for larger total pages", () => {
        expect(getPageNumbers(1, 100)).toEqual([1, 2, 3, 4, "...", 100]);
      });
    });

    describe("when current page is near the end (>= totalPages - 2)", () => {
      it("should show first page, ellipsis, and last 4 pages", () => {
        expect(getPageNumbers(8, 10)).toEqual([1, "...", 7, 8, 9, 10]);
        expect(getPageNumbers(9, 10)).toEqual([1, "...", 7, 8, 9, 10]);
        expect(getPageNumbers(10, 10)).toEqual([1, "...", 7, 8, 9, 10]);
      });

      it("should work for larger total pages", () => {
        expect(getPageNumbers(98, 100)).toEqual([1, "...", 97, 98, 99, 100]);
      });
    });

    describe("when current page is in the middle", () => {
      it("should show first page, ellipsis, current page ±1, ellipsis, last page", () => {
        expect(getPageNumbers(5, 10)).toEqual([1, "...", 4, 5, 6, "...", 10]);
        expect(getPageNumbers(6, 10)).toEqual([1, "...", 5, 6, 7, "...", 10]);
        expect(getPageNumbers(7, 10)).toEqual([1, "...", 6, 7, 8, "...", 10]);
      });

      it("should work for larger total pages", () => {
        expect(getPageNumbers(50, 100)).toEqual([
          1,
          "...",
          49,
          50,
          51,
          "...",
          100,
        ]);
      });
    });

    describe("edge cases", () => {
      it("should handle current page 0 (treats as page 1)", () => {
        expect(getPageNumbers(0, 10)).toEqual([1, 2, 3, 4, "...", 10]);
      });

      it("should handle current page greater than total pages (treats as last page)", () => {
        expect(getPageNumbers(15, 10)).toEqual([1, "...", 7, 8, 9, 10]);
      });

      it("should handle negative current page (treats as page 1)", () => {
        expect(getPageNumbers(-5, 10)).toEqual([1, 2, 3, 4, "...", 10]);
      });
    });
  });
});
