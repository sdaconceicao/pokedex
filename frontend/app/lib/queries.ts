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

export const SEARCH_POKEMON = gql`
  query SearchPokemon($query: String!, $limit: Int, $offset: Int) {
    pokemonSearch(query: $query, limit: $limit, offset: $offset) {
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

export const GET_POKEDEXES = gql`
  query GetPokedexes {
    pokedexes
  }
`;

export const GET_POKEMON_BY_POKEDEX = gql`
  query GetPokemonByPokedex($pokedex: String!, $limit: Int, $offset: Int) {
    pokemonByPokedex(pokedex: $pokedex, limit: $limit, offset: $offset) {
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

export const GET_REGIONS = gql`
  query GetRegions {
    regions
  }
`;

export const GET_POKEMON_BY_REGION = gql`
  query GetPokemonByRegion($region: String!, $limit: Int, $offset: Int) {
    pokemonByRegion(region: $region, limit: $limit, offset: $offset) {
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

export const GET_POKEMON_BY_ID = gql`
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
    }
  }
`;
