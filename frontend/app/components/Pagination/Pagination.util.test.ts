import { getEndItem, getStartItem, getTotalPages } from "./Pagination.util";

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
});
