import { act, renderHook } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import { useSortParam } from "./useSortParam";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

const setParams = (search: string) =>
  vi
    .mocked(useSearchParams)
    .mockReturnValue(new URLSearchParams(search) as unknown as ReturnType<typeof useSearchParams>);

const buildUrl = (sort: string) => `/search?sort=${sort}&page=1`;

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(window.history, "pushState").mockImplementation(() => {});
  setParams("");
});

describe("useSortParam", () => {
  it("defaults to the default sort when the URL carries none", () => {
    const { result } = renderHook(() => useSortParam(buildUrl));

    expect(result.current.sort).toBe("ID_ASC");
  });

  it("reads a recognised sort out of the URL", () => {
    setParams("sort=NAME_DESC");

    const { result } = renderHook(() => useSortParam(buildUrl));

    expect(result.current.sort).toBe("NAME_DESC");
  });

  it("falls back to the default for an unrecognised value", () => {
    setParams("sort=bogus");

    const { result } = renderHook(() => useSortParam(buildUrl));

    expect(result.current.sort).toBe("ID_ASC");
  });

  it("pushes the built URL rather than navigating", () => {
    const { result } = renderHook(() => useSortParam(buildUrl));

    act(() => {
      result.current.setSort("NAME_ASC");
    });

    expect(window.history.pushState).toHaveBeenCalledWith(null, "", "/search?sort=NAME_ASC&page=1");
  });
});
