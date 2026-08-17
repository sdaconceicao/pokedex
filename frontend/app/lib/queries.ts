import { gql } from "@apollo/client";

export const GET_TYPES = gql`
  query GetTypes {
    types {
      name
      count
    }
  }
`;

export const GET_POKEMON_BY_TYPE = gql`
  query GetPokemonByType($type: String!, $limit: Int, $offset: Int, $sort: PokemonSort) {
    pokemonByType(type: $type, limit: $limit, offset: $offset, sort: $sort) {
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
        abilitiesLite {
          id
          name
          url
          slot
          isHidden
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
        abilitiesLite {
          id
          name
          url
          slot
          isHidden
        }
      }
    }
  }
`;

/** The faceted search behind `/search`. Every facet is optional and an omitted
 *  one is skipped, so an empty filter browses the whole dex. */
export const FILTER_POKEMON = gql`
  query FilterPokemon($filter: PokemonFilter!, $limit: Int, $offset: Int, $sort: PokemonSort) {
    pokemonFilter(filter: $filter, limit: $limit, offset: $offset, sort: $sort) {
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
        abilitiesLite {
          id
          name
          url
          slot
          isHidden
        }
      }
    }
  }
`;

/** Names only, for the search field's suggestion dropdown — the list rows carry
 *  no artwork or stats, and the backend hydrates one upstream record per row. */
export const GET_POKEMON_NAME_SUGGESTIONS = gql`
  query GetPokemonNameSuggestions($query: String!, $limit: Int) {
    pokemonSearch(query: $query, limit: $limit) {
      pokemon {
        id
        name
      }
    }
  }
`;

export const GET_POKEDEXES = gql`
  query GetPokedexes {
    pokedexes {
      name
      count
    }
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
        abilitiesLite {
          id
          name
          url
          slot
          isHidden
        }
      }
    }
  }
`;

export const GET_REGIONS = gql`
  query GetRegions {
    regions {
      name
      count
    }
  }
`;

export const GET_POKEMON_BY_REGION = gql`
  query GetPokemonByRegion($region: String!, $limit: Int, $offset: Int, $sort: PokemonSort) {
    pokemonByRegion(region: $region, limit: $limit, offset: $offset, sort: $sort) {
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
        abilitiesLite {
          id
          name
          url
          slot
          isHidden
        }
      }
    }
  }
`;
