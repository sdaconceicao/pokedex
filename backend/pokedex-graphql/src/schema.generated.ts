// Generated from schema.graphql by scripts/embed-schema.mjs — do not edit.
export const typeDefs = /* GraphQL */ `
type Query {
  pokemon(id: ID!): Pokemon
  pokemonSearch(query: String!, limit: Int, offset: Int): PokemonList
  pokemonByType(type: String, limit: Int, offset: Int): PokemonList
  pokemonByPokedex(pokedex: String, limit: Int, offset: Int): PokemonList
  pokemonByRegion(region: String, limit: Int, offset: Int): PokemonList
  pokemonFilter(filter: PokemonFilter!, limit: Int, offset: Int): PokemonList
  ability(id: ID!): Ability
  types: [PokemonType!]!
  pokedexes: [PokemonPokedex!]!
  regions: [PokemonRegion!]!
  region(name: String!): RegionDetail
  type(name: String!): TypeDetail
}

"""
A pair of types that must BOTH be present. Requires two types by construction,
and matching ignores slot order — \`fire\` + \`flying\` and \`flying\` + \`fire\` select
the same Pokemon.
"""
input DualTypeFilter {
  primary: String!
  secondary: String!
}

"""
Every facet is OR internally and AND against the others. The one exception is
\`dualType\`, which is AND internally and is then OR'd into the type facet:

    (types ANY  OR  dualType BOTH)  AND  pokedexes ANY  AND  regions ANY  AND  query

So \`types: [fire, grass, ground]\` with \`dualType: {fire, flying}\` matches anything
that is fire, grass or ground, plus anything that is a fire/flying dual — and then
narrows that to the given pokedexes and regions.

Omitted facets are skipped rather than matching nothing; a filter with no facets
at all returns the full dex.
"""
input PokemonFilter {
  """
  Case-insensitive substring match on the Pokemon name.
  """
  query: String
  types: [String!]
  dualType: DualTypeFilter
  pokedexes: [String!]
  regions: [String!]
}

"""
Results are ordered by national dex number.
"""
type PokemonList {
  total: Int!
  offset: Int!
  pokemon: [Pokemon!]!
}

type Pokemon {
  id: ID!
  name: String!
  type: [String!]!
  image: String!
  stats: Stats!
  abilitiesLite: [AbilityLite!]!
  abilities: [Ability!]
  evolution: EvolutionChain
}

type EvolutionChain {
  id: ID!
  chain: EvolutionNode!
}

type EvolutionNode {
  id: ID!
  name: String!
  image: String!
  minLevel: Int
  trigger: String
  item: String
  evolvesTo: [EvolutionNode!]!
}

type Stats {
  hp: Int!
  attack: Int!
  defense: Int!
  specialAttack: Int!
  specialDefense: Int!
  speed: Int!
}

type AbilityLite {
  id: ID!
  name: String!
  url: String!
  slot: Int!
  isHidden: Boolean!
}

type Ability {
  id: ID!
  name: String!
  description: String!
  effect: String!
  generation: String!
  slot: Int!
}

type PokemonRegion {
  name: String!
  count: Int!
}

type RegionDetail {
  id: ID!
  name: String!
  displayName: String!
  generation: String
  pokemonCount: Int!
  locations: [String!]!
  pokedexes: [String!]!
  versionGroups: [String!]!
}

type PokemonPokedex {
  name: String!
  count: Int!
}

type PokemonType {
  name: String!
  count: Int!
}

type TypeDetail {
  id: ID!
  name: String!
  displayName: String!
  generation: String
  """
  The type's own icon, newest generation first.
  """
  sprite: String
  pokemonCount: Int!
  moveCount: Int!
  damageRelations: TypeDamageRelations!
}

"""
How this type fares in battle, as type names. The \`*To\` fields are what its own
attacks do; the \`*From\` fields are what it takes.
"""
type TypeDamageRelations {
  doubleDamageTo: [String!]!
  halfDamageTo: [String!]!
  noDamageTo: [String!]!
  doubleDamageFrom: [String!]!
  halfDamageFrom: [String!]!
  noDamageFrom: [String!]!
}
`;
