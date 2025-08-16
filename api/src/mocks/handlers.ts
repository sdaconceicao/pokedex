import { http, HttpResponse } from "msw";
import {
  pokemonList,
  pokemonEntity,
  pokemonAbility,
  typeResponse,
  pokedex,
  region,
  pokedexListResponse,
  regionListResponse,
  typeListResponse,
} from "./pokemon";

export const handlers = [
  // Pokemon list endpoint - used by loadPokemonIndex()
  http.get("https://pokeapi.co/api/v2/pokemon", ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit");

    if (limit === "1500") {
      // Return full list for index loading
      return HttpResponse.json(pokemonList);
    }

    // Return paginated list for regular requests
    return HttpResponse.json(pokemonList);
  }),

  // Pokemon detail endpoint - used by getPokemon()
  http.get("https://pokeapi.co/api/v2/pokemon/:id", () => {
    // Return mock data for any Pokemon ID
    return HttpResponse.json(pokemonEntity);
  }),

  // Ability endpoint - used by getAbility()
  http.get("https://pokeapi.co/api/v2/ability/:id", () => {
    // Return mock data for any ability ID
    return HttpResponse.json(pokemonAbility);
  }),

  // Type endpoint - used by getPokemonByType()
  http.get("https://pokeapi.co/api/v2/type/:type", () => {
    // Return mock data for any type
    return HttpResponse.json(typeResponse);
  }),

  // Pokedex endpoint - used by getPokemonByPokedex()
  http.get("https://pokeapi.co/api/v2/pokedex/:pokedex", () => {
    // Return mock data for any pokedex
    return HttpResponse.json(pokedex);
  }),

  // Region endpoint - used by getPokemonByRegion()
  http.get("https://pokeapi.co/api/v2/region/:region", () => {
    // Return mock data for any region
    return HttpResponse.json(region);
  }),

  // Pokedex list endpoint - used by getPokedexes()
  http.get("https://pokeapi.co/api/v2/pokedex", ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit");

    if (limit === "50") {
      return HttpResponse.json(pokedexListResponse);
    }

    return HttpResponse.json(pokedexListResponse);
  }),

  // Region list endpoint - used by getRegions()
  http.get("https://pokeapi.co/api/v2/region", ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit");

    if (limit === "50") {
      return HttpResponse.json(regionListResponse);
    }

    return HttpResponse.json(regionListResponse);
  }),

  // Type list endpoint - used by getTypes()
  http.get("https://pokeapi.co/api/v2/type", ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit");

    if (limit === "50") {
      return HttpResponse.json(typeListResponse);
    }

    return HttpResponse.json(typeListResponse);
  }),
];
