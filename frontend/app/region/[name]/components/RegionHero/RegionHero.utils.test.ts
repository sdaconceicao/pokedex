import { formatGeneration } from "./RegionHero.utils";

describe("formatGeneration", () => {
  it("upper cases the Roman numeral", () => {
    expect(formatGeneration("generation-i")).toBe("Generation I");
    expect(formatGeneration("generation-vii")).toBe("Generation VII");
  });

  it("title cases a value that isn't shaped like a generation slug", () => {
    expect(formatGeneration("unknown-era")).toBe("Unknown Era");
  });

  it("returns null when the region has no generation", () => {
    expect(formatGeneration(null)).toBeNull();
    expect(formatGeneration(undefined)).toBeNull();
    expect(formatGeneration("")).toBeNull();
  });
});
