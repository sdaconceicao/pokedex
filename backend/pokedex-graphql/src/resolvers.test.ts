import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";
import { createSchema, createYoga } from "graphql-yoga";
import { HttpResponse, http } from "msw";
import { createContext, type DataSourceContext } from "./context.js";
import { PokemonAPI } from "./datasources/pokemon-api.js";
import { pokemonEntity } from "./mocks/pokemon.js";
import { server } from "./mocks/server.js";
import { resolvers } from "./resolvers.js";
import { typeDefs } from "./schema.generated.js";

const yoga = createYoga({
  schema: createSchema<DataSourceContext>({ typeDefs, resolvers }),
  context: () => createContext({ cache: new InMemoryLRUCache() }),
});

const run = async (query: string, variables?: Record<string, unknown>) => {
  const response = await yoga.fetch("http://pokedex.test/graphql", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const { data, errors } = (await response.json()) as {
    data?: Record<string, unknown>;
    errors?: unknown[];
  };

  expect(errors).toBeUndefined();
  expect(data).toBeDefined();

  return data as Record<string, unknown>;
};

beforeEach(() => {
  PokemonAPI.resetIndexes();
});

describe("pokemonForms", () => {
  it("browses every form when given no query", async () => {
    const data = await run(`{ pokemonForms { total pokemon { id } } }`);

    expect(data.pokemonForms).toMatchObject({ total: 3 });
  });

  it("narrows to a substring of the form name", async () => {
    const data = await run(`{ pokemonForms(query: "gmax") { total } }`);

    expect(data.pokemonForms).toMatchObject({ total: 2 });
  });

  it("counts forms, not species", async () => {
    const data = await run(`{ pokemonForms { total } }`);
    const all = await run(`{ pokemonFilter(filter: {}) { total } }`);

    expect(data.pokemonForms).toMatchObject({ total: 3 });
    expect(all?.pokemonFilter).toMatchObject({ total: 6 });
  });

  it("paginates and echoes the offset back", async () => {
    const data = await run(`{ pokemonForms(limit: 2, offset: 1) { total offset pokemon { id } } }`);

    expect(data.pokemonForms).toMatchObject({ total: 3, offset: 1 });
    expect((data.pokemonForms as { pokemon: unknown[] }).pokemon).toHaveLength(2);
  });

  it("orders by id by default and alphabetically when asked", async () => {
    const names = async (sort: string) => {
      const data = await run(`{ pokemonForms(sort: ${sort}) { pokemon { name } } }`);
      return (data.pokemonForms as { pokemon: { name: string }[] }).pokemon.map((p) => p.name);
    };

    expect(await names("ID_ASC")).toEqual(["charizard-mega-x", "bulbasaur-gmax", "pikachu-gmax"]);
    expect(await names("NAME_ASC")).toEqual(["bulbasaur-gmax", "charizard-mega-x", "pikachu-gmax"]);
  });
});

describe("pokemonFilter", () => {
  it("browses the species index, not the pokemon list, when the filter is empty", async () => {
    const data = await run(`{ pokemonFilter(filter: {}) { total } }`);

    expect(data.pokemonFilter).toMatchObject({ total: 6 });
  });

  it("does not match a form name", async () => {
    const data = await run(`{ pokemonFilter(filter: { query: "gmax" }) { total } }`);

    expect(data.pokemonFilter).toMatchObject({ total: 0 });
  });
});

describe("Pokemon.forms", () => {
  it("lists every variety of the species, default first", async () => {
    const data = await run(`{ pokemon(id: "1") { forms { id name isDefault } } }`);

    expect(data.pokemon).toEqual({
      forms: [
        { id: "1", name: "bulbasaur", isDefault: true },
        { id: "10186", name: "bulbasaur-gmax", isDefault: false },
      ],
    });
  });

  it("resolves the same list from a form as from its species", async () => {
    const fromSpecies = await run(`{ pokemon(id: "1") { forms { id } } }`);
    const fromForm = await run(`{ pokemon(id: "10186") { forms { id } } }`);

    expect(fromForm).toEqual(fromSpecies);
  });

  it("degrades to null instead of nulling the whole Pokemon", async () => {
    server.use(
      http.get(
        "https://pokeapi.co/api/v2/pokemon-species/:id",
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    const data = await run(`{ pokemon(id: "1") { name forms { id } } }`);

    expect(data.pokemon).toEqual({ name: "bulbasaur", forms: null });
  });
});

describe("Pokemon.speciesId", () => {
  it("equals the id for a default Pokemon", async () => {
    const data = await run(`{ pokemon(id: "1") { id speciesId } }`);

    expect(data.pokemon).toEqual({ id: "1", speciesId: "1" });
  });

  it("points at the base species for a form", async () => {
    const data = await run(`{ pokemon(id: "10186") { id speciesId } }`);

    expect(data.pokemon).toEqual({ id: "10186", speciesId: "1" });
  });
});

describe("Pokemon.speciesName", () => {
  it("names the species rather than the Pokemon", async () => {
    const data = await run(`{ pokemon(id: "10186") { name speciesName } }`);

    expect(data.pokemon).toEqual({ name: "bulbasaur-gmax", speciesName: "bulbasaur" });
  });

  it("is the species even when the default form's name carries a suffix", async () => {
    server.use(
      http.get("https://pokeapi.co/api/v2/pokemon/:id", () =>
        HttpResponse.json({
          ...pokemonEntity,
          id: 681,
          name: "aegislash-shield",
          species: { name: "aegislash", url: "https://pokeapi.co/api/v2/pokemon-species/681/" },
        }),
      ),
    );

    const data = await run(`{ pokemon(id: "681") { name speciesName } }`);

    expect(data.pokemon).toEqual({ name: "aegislash-shield", speciesName: "aegislash" });
  });
});

describe("Pokemon.evolution", () => {
  it("resolves on a form page rather than 404ing on its id", async () => {
    const data = await run(`{ pokemon(id: "10186") { evolution { chain { name } } } }`);

    expect(data.pokemon).toEqual({ evolution: { chain: { name: "bulbasaur" } } });
  });

  it("names each stage by its species rather than its default form", async () => {
    // A chain is a chain of species, so a stage whose base form is spelled
    // `aegislash-shield` upstream still reads "aegislash" here.
    server.use(
      http.get("https://pokeapi.co/api/v2/pokemon/:id", () =>
        HttpResponse.json({ ...pokemonEntity, id: 681, name: "aegislash-shield" }),
      ),
    );

    const data = await run(`{ pokemon(id: "1") { evolution { chain { name } } } }`);

    expect(data.pokemon).toEqual({ evolution: { chain: { name: "bulbasaur" } } });
  });
});
