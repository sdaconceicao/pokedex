import { client } from "./apollo-client";
import { GET_POKEMON_BY_ID } from "./queries";

export async function getPokemonById(id: string) {
  try {
    console.log("Attempting to fetch Pokemon with ID:", id);

    const { data, error } = await client.query({
      query: GET_POKEMON_BY_ID,
      variables: { id },
    });

    if (error) {
      console.error("GraphQL error:", error);
      throw error;
    }

    return data.pokemon;
  } catch (error) {
    console.error("Failed to fetch Pokemon:", error);
    throw error;
  }
}
