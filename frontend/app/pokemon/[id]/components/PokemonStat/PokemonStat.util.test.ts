import { getStatPercentage } from "./PokemonStat.util";

describe("PokemonStat Utilities", () => {
  describe("getStatPercentage", () => {
    it("should calculate percentage correctly for maximum stat value", () => {
      expect(getStatPercentage(255)).toBe(100);
    });

    it("should calculate percentage correctly for minimum stat value", () => {
      expect(getStatPercentage(0)).toBe(0);
    });

    it("should calculate percentage correctly for middle stat values", () => {
      expect(getStatPercentage(127)).toBeCloseTo(49.8, 1);
      expect(getStatPercentage(128)).toBeCloseTo(50.2, 1);
    });

    it("should calculate percentage correctly for common stat values", () => {
      // HP stat examples
      expect(getStatPercentage(45)).toBeCloseTo(17.6, 1);
      expect(getStatPercentage(60)).toBeCloseTo(23.5, 1);
      expect(getStatPercentage(95)).toBeCloseTo(37.3, 1);
      expect(getStatPercentage(130)).toBeCloseTo(51.0, 1);
      expect(getStatPercentage(160)).toBeCloseTo(62.7, 1);
      expect(getStatPercentage(200)).toBeCloseTo(78.4, 1);
      expect(getStatPercentage(250)).toBeCloseTo(98.0, 1);
    });

    it("should handle decimal stat values correctly", () => {
      expect(getStatPercentage(127.5)).toBeCloseTo(50.0, 1);
      expect(getStatPercentage(255.0)).toBe(100);
    });

    it("should handle edge cases", () => {
      expect(getStatPercentage(1)).toBeCloseTo(0.4, 1);
      expect(getStatPercentage(254)).toBeCloseTo(99.6, 1);
    });

    it("should maintain precision for small stat values", () => {
      expect(getStatPercentage(10)).toBeCloseTo(3.9, 1);
      expect(getStatPercentage(25)).toBeCloseTo(9.8, 1);
      expect(getStatPercentage(50)).toBeCloseTo(19.6, 1);
    });

    it("should maintain precision for high stat values", () => {
      expect(getStatPercentage(200)).toBeCloseTo(78.4, 1);
      expect(getStatPercentage(225)).toBeCloseTo(88.2, 1);
      expect(getStatPercentage(240)).toBeCloseTo(94.1, 1);
    });

    it("should handle negative values gracefully", () => {
      expect(getStatPercentage(-10)).toBeCloseTo(-3.9, 1);
      expect(getStatPercentage(-100)).toBeCloseTo(-39.2, 1);
    });

    it("should handle very large values", () => {
      expect(getStatPercentage(500)).toBeCloseTo(196.1, 1);
      expect(getStatPercentage(1000)).toBeCloseTo(392.2, 1);
    });

    it("should handle fractional values with high precision", () => {
      expect(getStatPercentage(0.5)).toBeCloseTo(0.2, 1);
      expect(getStatPercentage(127.25)).toBeCloseTo(49.9, 1);
      expect(getStatPercentage(200.75)).toBeCloseTo(78.7, 1);
    });
  });
});
