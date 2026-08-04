import { getDexNumber } from "./PokemonHero.utils";

describe("PokemonHero Utilities", () => {
  describe("getDexNumber", () => {
    it("should pad single digit ids to three digits", () => {
      expect(getDexNumber(1)).toBe("#001");
      expect(getDexNumber(4)).toBe("#004");
    });

    it("should pad double digit ids to three digits", () => {
      expect(getDexNumber(25)).toBe("#025");
    });

    it("should leave three digit ids unpadded", () => {
      expect(getDexNumber(151)).toBe("#151");
    });

    it("should not truncate ids longer than three digits", () => {
      expect(getDexNumber(1025)).toBe("#1025");
    });

    it("should accept string ids, matching the GraphQL ID scalar", () => {
      expect(getDexNumber("7")).toBe("#007");
      expect(getDexNumber("143")).toBe("#143");
    });
  });
});
