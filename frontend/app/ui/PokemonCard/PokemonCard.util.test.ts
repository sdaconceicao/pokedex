import {
  formatPokemonName,
  getPokemonTypeClass,
  getPrimaryType,
} from "./PokemonCard.utils";

describe("PokemonCard Utils", () => {
  describe("formatPokemonName", () => {
    it("capitalizes first letter of lowercase name", () => {
      expect(formatPokemonName("bulbasaur")).toBe("Bulbasaur");
    });

    it("handles already capitalized name", () => {
      expect(formatPokemonName("Bulbasaur")).toBe("Bulbasaur");
    });

    it("handles all uppercase name", () => {
      expect(formatPokemonName("CHARIZARD")).toBe("CHARIZARD");
    });

    it("handles name with hyphens", () => {
      expect(formatPokemonName("mr-mime")).toBe("Mr-mime");
    });

    it("handles single character name", () => {
      expect(formatPokemonName("a")).toBe("A");
    });

    it("handles empty string", () => {
      expect(formatPokemonName("")).toBe("");
    });

    it("handles name with numbers", () => {
      expect(formatPokemonName("pikachu123")).toBe("Pikachu123");
    });

    it("maintains function purity", () => {
      const input = "bulbasaur";
      const result1 = formatPokemonName(input);
      const result2 = formatPokemonName(input);

      expect(result1).toBe(result2);
      expect(input).toBe("bulbasaur"); // Original unchanged
    });
  });

  describe("getPokemonTypeClass", () => {
    it("generates correct CSS class for normal type", () => {
      expect(getPokemonTypeClass("normal")).toBe("type-normal");
    });

    it("generates correct CSS class for fire type", () => {
      expect(getPokemonTypeClass("fire")).toBe("type-fire");
    });

    it("handles uppercase type names", () => {
      expect(getPokemonTypeClass("FIRE")).toBe("type-fire");
    });

    it("handles mixed case type names", () => {
      expect(getPokemonTypeClass("FiRe")).toBe("type-fire");
    });

    it("handles type names with special characters", () => {
      expect(getPokemonTypeClass("fairy-type")).toBe("type-fairy-type");
    });

    it("handles empty string", () => {
      expect(getPokemonTypeClass("")).toBe("type-");
    });

    it("maintains function purity", () => {
      const input = "water";
      const result1 = getPokemonTypeClass(input);
      const result2 = getPokemonTypeClass(input);

      expect(result1).toBe(result2);
      expect(input).toBe("water"); // Original unchanged
    });
  });

  describe("getPrimaryType", () => {
    it("returns first type from array", () => {
      expect(getPrimaryType(["grass", "poison"])).toBe("grass");
    });

    it("returns single type from array", () => {
      expect(getPrimaryType(["fire"])).toBe("fire");
    });

    it("returns default type for empty array", () => {
      expect(getPrimaryType([])).toBe("normal");
    });

    it("handles array with single empty string", () => {
      expect(getPrimaryType([""])).toBe("normal");
    });

    it("handles array with multiple empty strings", () => {
      expect(getPrimaryType(["", "fire"])).toBe("normal");
    });

    it("maintains function purity", () => {
      const input = ["water", "ice"];
      const result1 = getPrimaryType(input);
      const result2 = getPrimaryType(input);

      expect(result1).toBe(result2);
      expect(input).toEqual(["water", "ice"]); // Original unchanged
    });

    it("handles edge cases", () => {
      expect(getPrimaryType(["electric", "flying", "psychic"])).toBe(
        "electric"
      );
      expect(getPrimaryType(["dark"])).toBe("dark");
      expect(getPrimaryType(["steel", "fairy"])).toBe("steel");
    });
  });
});
