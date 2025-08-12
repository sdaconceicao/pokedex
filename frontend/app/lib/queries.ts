import { gql } from "@apollo/client";

export const GET_TYPES = gql`
  query GetTypes {
    types
  }
`;

export const GET_POKEMON_BY_TYPE = gql`
  query GetPokemonByType($type: String!, $limit: Int, $offset: Int) {
    pokemonByType(type: $type, limit: $limit, offset: $offset) {
      total
      offset
      pokemon {
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
      }
    }
  }
`;
