import { capitalize, titleCase } from "./string";

describe("capitalize", () => {
  it("should capitalize the first character of a string", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("world")).toBe("World");
    expect(capitalize("pokemon")).toBe("Pokemon");
  });

  it("should handle single character strings", () => {
    expect(capitalize("a")).toBe("A");
    expect(capitalize("z")).toBe("Z");
  });

  it("should handle already capitalized strings", () => {
    expect(capitalize("Hello")).toBe("Hello");
    expect(capitalize("WORLD")).toBe("WORLD");
  });

  it("should handle empty string", () => {
    expect(capitalize("")).toBe("");
  });

  it("should handle strings with special characters", () => {
    expect(capitalize("hello-world")).toBe("Hello-world");
    expect(capitalize("123abc")).toBe("123abc");
    expect(capitalize("!hello")).toBe("!hello");
  });
});

describe("titleCase", () => {
  it("should capitalize every hyphen-separated word", () => {
    expect(titleCase("letsgo-kanto")).toBe("Letsgo Kanto");
    expect(titleCase("ultra-sun-ultra-moon")).toBe("Ultra Sun Ultra Moon");
  });

  it("should capitalize a single word", () => {
    expect(titleCase("yellow")).toBe("Yellow");
  });

  it("should handle empty string", () => {
    expect(titleCase("")).toBe("");
  });
});
