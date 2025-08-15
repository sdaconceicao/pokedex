import { client } from "./apollo-client";
import { gql } from "@apollo/client";
import type { Pokemon } from "./types";

const GET_POKEMON_BY_ID = gql`
  query GetPokemonById($id: ID!) {
    pokemon(id: $id) {
      id
      name
      type
      image
      stats {
        hp
        attack
        defense
        specialAttack
        specialDefense
        speed
      }
      abilitiesLite {
        id
        name
        url
        slot
        isHidden
      }
      abilities {
        id
        name
        description
        effect
        generation
        slot
      }
    }
  }
`;

export async function getPokemonById(id: string): Promise<Pokemon> {
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

    if (!data.pokemon) {
      throw new Error(`Pokemon with ID ${id} not found`);
    }

    return data.pokemon;
  } catch (error) {
    console.error("Failed to fetch Pokemon:", error);
    throw error;
  }
}
