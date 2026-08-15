import { composeSort, DEFAULT_SORT, encodeSort, parseSort, sortDirection, sortField } from "./sort";

describe("parseSort", () => {
  it("reads a recognised sort", () => {
    expect(parseSort("ID_ASC")).toBe("ID_ASC");
    expect(parseSort("ID_DESC")).toBe("ID_DESC");
    expect(parseSort("NAME_ASC")).toBe("NAME_ASC");
    expect(parseSort("NAME_DESC")).toBe("NAME_DESC");
  });

  it("falls back to the default for anything unusable", () => {
    expect(parseSort(null)).toBe(DEFAULT_SORT);
    expect(parseSort(undefined)).toBe(DEFAULT_SORT);
    expect(parseSort("")).toBe(DEFAULT_SORT);
    expect(parseSort("name")).toBe(DEFAULT_SORT);
    expect(parseSort("bogus")).toBe(DEFAULT_SORT);
  });
});

describe("encodeSort", () => {
  it("omits the default sort", () => {
    expect(encodeSort(DEFAULT_SORT)).toBeUndefined();
    expect(encodeSort(undefined)).toBeUndefined();
  });

  it("emits anything else as-is", () => {
    expect(encodeSort("ID_DESC")).toBe("ID_DESC");
    expect(encodeSort("NAME_ASC")).toBe("NAME_ASC");
    expect(encodeSort("NAME_DESC")).toBe("NAME_DESC");
  });

  it("round-trips with parseSort", () => {
    for (const sort of ["ID_ASC", "ID_DESC", "NAME_ASC", "NAME_DESC"] as const) {
      expect(parseSort(encodeSort(sort))).toBe(sort);
    }
  });
});

describe("sortField", () => {
  it("reads the field half of a sort", () => {
    expect(sortField("ID_ASC")).toBe("ID");
    expect(sortField("ID_DESC")).toBe("ID");
    expect(sortField("NAME_ASC")).toBe("NAME");
    expect(sortField("NAME_DESC")).toBe("NAME");
  });
});

describe("sortDirection", () => {
  it("reads the direction half of a sort", () => {
    expect(sortDirection("ID_ASC")).toBe("ASC");
    expect(sortDirection("NAME_ASC")).toBe("ASC");
    expect(sortDirection("ID_DESC")).toBe("DESC");
    expect(sortDirection("NAME_DESC")).toBe("DESC");
  });
});

describe("composeSort", () => {
  it("recombines a field and direction into a PokemonSort", () => {
    expect(composeSort("ID", "ASC")).toBe("ID_ASC");
    expect(composeSort("ID", "DESC")).toBe("ID_DESC");
    expect(composeSort("NAME", "ASC")).toBe("NAME_ASC");
    expect(composeSort("NAME", "DESC")).toBe("NAME_DESC");
  });

  it("round-trips with sortField and sortDirection", () => {
    for (const sort of ["ID_ASC", "ID_DESC", "NAME_ASC", "NAME_DESC"] as const) {
      expect(composeSort(sortField(sort), sortDirection(sort))).toBe(sort);
    }
  });
});
