import { client } from "../lib/apollo-client";
import { getTypes, getPokedexes, getRegions } from "./NavigationDataProvider";
import NavigationDataProvider from "./NavigationDataProvider";
import { PokemonType, PokemonRegion, PokemonPokedex } from "../lib/types";

// Mock the Apollo client
jest.mock("../lib/apollo-client", () => ({
  client: {
    query: jest.fn(),
  },
}));

const mockClient = client as jest.Mocked<typeof client>;

// Helper type for mock query results
type MockQueryResult<T> = never;

describe("NavigationDataProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTypes", () => {
    it("should fetch types and filter out those with count 0", async () => {
      const mockTypes: PokemonType[] = [
        { name: "fire", count: 5 },
        { name: "water", count: 0 },
        { name: "grass", count: 3 },
        { name: "electric", count: 0 },
        { name: "psychic", count: 2 },
      ];

      mockClient.query.mockResolvedValue({
        data: { types: mockTypes },
      } as MockQueryResult<{ types: PokemonType[] }>);

      const result = await getTypes();

      expect(mockClient.query).toHaveBeenCalledWith({
        query: expect.any(Object),
      });
      expect(result).toEqual([
        { name: "fire", count: 5 },
        { name: "grass", count: 3 },
        { name: "psychic", count: 2 },
      ]);
    });

    it("should return empty array when no types have count > 0", async () => {
      const mockTypes: PokemonType[] = [
        { name: "fire", count: 0 },
        { name: "water", count: 0 },
        { name: "grass", count: 0 },
      ];

      mockClient.query.mockResolvedValue({
        data: { types: mockTypes },
      } as MockQueryResult<{ types: PokemonType[] }>);

      const result = await getTypes();

      expect(result).toEqual([]);
    });

    it("should return empty array when types data is undefined", async () => {
      mockClient.query.mockResolvedValue({
        data: { types: undefined },
      } as MockQueryResult<{ types: PokemonType[] | undefined }>);

      const result = await getTypes();

      expect(result).toEqual([]);
    });

    it("should return empty array when types data is null", async () => {
      mockClient.query.mockResolvedValue({
        data: { types: null },
      } as MockQueryResult<{ types: PokemonType[] | null }>);

      const result = await getTypes();

      expect(result).toEqual([]);
    });

    it("should handle errors gracefully and return empty array", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockClient.query.mockRejectedValue(new Error("Network error"));

      const result = await getTypes();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching types:",
        expect.any(Error)
      );
      expect(result).toEqual([]);

      consoleSpy.mockRestore();
    });

    it("should handle empty types array", async () => {
      mockClient.query.mockResolvedValue({
        data: { types: [] },
      } as MockQueryResult<{ types: PokemonType[] }>);

      const result = await getTypes();

      expect(result).toEqual([]);
    });
  });

  describe("getPokedexes", () => {
    it("should fetch pokedexes successfully", async () => {
      const mockPokedexes: PokemonPokedex[] = [
        { name: "national", count: 1008 },
        { name: "kanto", count: 151 },
        { name: "johto", count: 100 },
        { name: "hoenn", count: 135 },
      ];

      mockClient.query.mockResolvedValue({
        data: { pokedexes: mockPokedexes },
      } as MockQueryResult<{ pokedexes: PokemonPokedex[] }>);

      const result = await getPokedexes();

      expect(mockClient.query).toHaveBeenCalledWith({
        query: expect.any(Object), // GraphQL query object
      });
      expect(result).toEqual(mockPokedexes);
    });

    it("should return empty array when pokedexes data is undefined", async () => {
      mockClient.query.mockResolvedValue({
        data: { pokedexes: undefined },
      } as MockQueryResult<{ pokedexes: PokemonPokedex[] | undefined }>);

      const result = await getPokedexes();

      expect(result).toEqual([]);
    });

    it("should return empty array when pokedexes data is null", async () => {
      mockClient.query.mockResolvedValue({
        data: { pokedexes: null },
      } as MockQueryResult<{ pokedexes: PokemonPokedex[] | null }>);

      const result = await getPokedexes();

      expect(result).toEqual([]);
    });

    it("should handle errors gracefully and return empty array", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockClient.query.mockRejectedValue(new Error("Network error"));

      const result = await getPokedexes();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching pokedexes:",
        expect.any(Error)
      );
      expect(result).toEqual([]);

      consoleSpy.mockRestore();
    });

    it("should handle empty pokedexes array", async () => {
      mockClient.query.mockResolvedValue({
        data: { pokedexes: [] },
      } as MockQueryResult<{ pokedexes: PokemonPokedex[] }>);

      const result = await getPokedexes();

      expect(result).toEqual([]);
    });

    it("should filter out pokedexes with count 0", async () => {
      const mockPokedexes: PokemonPokedex[] = [
        { name: "national", count: 1008 },
        { name: "kanto", count: 0 },
        { name: "johto", count: 100 },
        { name: "hoenn", count: 0 },
        { name: "sinnoh", count: 107 },
      ];

      mockClient.query.mockResolvedValue({
        data: { pokedexes: mockPokedexes },
      } as MockQueryResult<{ pokedexes: PokemonPokedex[] }>);

      const result = await getPokedexes();

      expect(result).toEqual([
        { name: "national", count: 1008 },
        { name: "johto", count: 100 },
        { name: "sinnoh", count: 107 },
      ]);
    });
  });

  describe("getRegions", () => {
    it("should fetch regions and filter out those with count 0", async () => {
      const mockRegions: PokemonRegion[] = [
        { name: "kanto", count: 151 },
        { name: "johto", count: 0 },
        { name: "hoenn", count: 135 },
        { name: "sinnoh", count: 0 },
        { name: "unova", count: 156 },
      ];

      mockClient.query.mockResolvedValue({
        data: { regions: mockRegions },
      } as MockQueryResult<{ regions: PokemonRegion[] }>);

      const result = await getRegions();

      expect(mockClient.query).toHaveBeenCalledWith({
        query: expect.any(Object),
      });
      expect(result).toEqual([
        { name: "kanto", count: 151 },
        { name: "hoenn", count: 135 },
        { name: "unova", count: 156 },
      ]);
    });

    it("should return empty array when no regions have count > 0", async () => {
      const mockRegions: PokemonRegion[] = [
        { name: "kanto", count: 0 },
        { name: "johto", count: 0 },
        { name: "hoenn", count: 0 },
      ];

      mockClient.query.mockResolvedValue({
        data: { regions: mockRegions },
      } as MockQueryResult<{ regions: PokemonRegion[] }>);

      const result = await getRegions();

      expect(result).toEqual([]);
    });

    it("should return empty array when regions data is undefined", async () => {
      mockClient.query.mockResolvedValue({
        data: { regions: undefined },
      } as MockQueryResult<{ regions: PokemonRegion[] | undefined }>);

      const result = await getRegions();

      expect(result).toEqual([]);
    });

    it("should return empty array when regions data is null", async () => {
      mockClient.query.mockResolvedValue({
        data: { regions: null },
      } as MockQueryResult<{ regions: PokemonRegion[] | null }>);

      const result = await getRegions();

      expect(result).toEqual([]);
    });

    it("should handle errors gracefully and return empty array", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockClient.query.mockRejectedValue(new Error("Network error"));

      const result = await getRegions();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching regions:",
        expect.any(Error)
      );
      expect(result).toEqual([]);

      consoleSpy.mockRestore();
    });

    it("should handle empty regions array", async () => {
      mockClient.query.mockResolvedValue({
        data: { regions: [] },
      } as MockQueryResult<{ regions: PokemonRegion[] }>);

      const result = await getRegions();

      expect(result).toEqual([]);
    });
  });

  describe("NavigationDataProvider", () => {
    it("should fetch all data concurrently and return combined result", async () => {
      const mockTypes: PokemonType[] = [
        { name: "fire", count: 5 },
        { name: "water", count: 3 },
      ];
      const mockPokedexes: PokemonPokedex[] = [
        { name: "national", count: 1008 },
        { name: "kanto", count: 151 },
      ];
      const mockRegions: PokemonRegion[] = [
        { name: "kanto", count: 151 },
        { name: "johto", count: 100 },
      ];

      // Mock all three queries
      mockClient.query
        .mockResolvedValueOnce({
          data: { types: mockTypes },
        } as MockQueryResult<{ types: PokemonType[] }>)
        .mockResolvedValueOnce({
          data: { pokedexes: mockPokedexes },
        } as MockQueryResult<{ pokedexes: PokemonPokedex[] }>)
        .mockResolvedValueOnce({
          data: { regions: mockRegions },
        } as MockQueryResult<{ regions: PokemonRegion[] }>);

      const result = await NavigationDataProvider();

      expect(mockClient.query).toHaveBeenCalledTimes(3);
      expect(result).toEqual({
        types: mockTypes,
        pokedexes: mockPokedexes,
        regions: mockRegions,
      });
    });

    it("should handle mixed data with filtering applied", async () => {
      const mockTypes: PokemonType[] = [
        { name: "fire", count: 5 },
        { name: "water", count: 0 }, // Should be filtered out
        { name: "grass", count: 3 },
      ];
      const mockPokedexes: PokemonPokedex[] = [
        { name: "national", count: 1008 },
        { name: "kanto", count: 0 },
        { name: "johto", count: 100 },
      ];
      const mockRegions: PokemonRegion[] = [
        { name: "kanto", count: 151 },
        { name: "johto", count: 0 }, // Should be filtered out
        { name: "hoenn", count: 135 },
      ];

      // Mock all three queries
      mockClient.query
        .mockResolvedValueOnce({
          data: { types: mockTypes },
        } as MockQueryResult<{ types: PokemonType[] }>)
        .mockResolvedValueOnce({
          data: { pokedexes: mockPokedexes },
        } as MockQueryResult<{ pokedexes: PokemonPokedex[] }>)
        .mockResolvedValueOnce({
          data: { regions: mockRegions },
        } as MockQueryResult<{ regions: PokemonRegion[] }>);

      const result = await NavigationDataProvider();

      expect(result).toEqual({
        types: [
          { name: "fire", count: 5 },
          { name: "grass", count: 3 },
        ],
        pokedexes: [
          { name: "national", count: 1008 },
          { name: "johto", count: 100 },
        ],
        regions: [
          { name: "kanto", count: 151 },
          { name: "hoenn", count: 135 },
        ],
      });
    });

    it("should handle errors in individual queries gracefully", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const mockTypes: PokemonType[] = [{ name: "fire", count: 5 }];

      // Mock successful types query, failed pokedexes query, successful regions query
      mockClient.query
        .mockResolvedValueOnce({
          data: { types: mockTypes },
        } as MockQueryResult<{ types: PokemonType[] }>)
        .mockRejectedValueOnce(new Error("Pokedexes error"))
        .mockResolvedValueOnce({ data: { regions: [] } } as MockQueryResult<{
          regions: PokemonRegion[];
        }>);

      const result = await NavigationDataProvider();

      expect(result).toEqual({
        types: mockTypes,
        pokedexes: [],
        regions: [],
      });

      consoleSpy.mockRestore();
    });
  });
});
