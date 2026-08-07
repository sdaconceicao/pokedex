import { parsePage } from "./pagination";

describe("parsePage", () => {
  it("reads a valid page number", () => {
    expect(parsePage("2")).toBe(2);
    expect(parsePage("14")).toBe(14);
  });

  it("falls back to the first page for anything unusable", () => {
    expect(parsePage(null)).toBe(1);
    expect(parsePage(undefined)).toBe(1);
    expect(parsePage("")).toBe(1);
    expect(parsePage("0")).toBe(1);
    expect(parsePage("-3")).toBe(1);
    expect(parsePage("1.5")).toBe(1);
    expect(parsePage("banana")).toBe(1);
  });
});
