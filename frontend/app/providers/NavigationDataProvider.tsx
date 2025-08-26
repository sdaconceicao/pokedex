import { PokemonType, PokemonRegion, PokemonPokedex } from "@/lib/types";
import { client } from "@/lib/apollo-client";
import { GET_TYPES, GET_POKEDEXES, GET_REGIONS } from "@/lib/queries";

export interface NavigationData {
  types: PokemonType[];
  pokedexes: PokemonPokedex[];
  regions: PokemonRegion[];
}

export const getTypes = async (): Promise<PokemonType[]> => {
  try {
    const { data } = await client.query<{ types: PokemonType[] }>({
      query: GET_TYPES,
    });
    return data.types?.filter((type) => type.count > 0) || [];
  } catch (error) {
    console.error("Error fetching types:", error);
    return [];
  }
};

export const getPokedexes = async (): Promise<PokemonPokedex[]> => {
  try {
    const { data } = await client.query<{ pokedexes: PokemonPokedex[] }>({
      query: GET_POKEDEXES,
    });
    return data.pokedexes?.filter((pokedex) => pokedex.count > 0) || [];
  } catch (error) {
    console.error("Error fetching pokedexes:", error);
    return [];
  }
};

export const getRegions = async (): Promise<PokemonRegion[]> => {
  try {
    const { data } = await client.query<{ regions: PokemonRegion[] }>({
      query: GET_REGIONS,
    });
    return data.regions?.filter((region) => region.count > 0) || [];
  } catch (error) {
    console.error("Error fetching regions:", error);
    return [];
  }
};

export default async function NavigationDataProvider() {
  const [types, pokedexes, regions] = await Promise.all([
    getTypes(),
    getPokedexes(),
    getRegions(),
  ]);

  return { types, pokedexes, regions };
}
