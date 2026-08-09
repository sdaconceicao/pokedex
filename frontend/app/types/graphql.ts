export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Ability = {
  description: Scalars['String']['output'];
  effect: Scalars['String']['output'];
  generation: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  slot: Scalars['Int']['output'];
};

export type AbilityLite = {
  id: Scalars['ID']['output'];
  isHidden: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  slot: Scalars['Int']['output'];
  url: Scalars['String']['output'];
};

export type EvolutionChain = {
  chain: EvolutionNode;
  id: Scalars['ID']['output'];
};

export type EvolutionNode = {
  evolvesTo: Array<EvolutionNode>;
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  item?: Maybe<Scalars['String']['output']>;
  minLevel?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  trigger?: Maybe<Scalars['String']['output']>;
};

export type Pokemon = {
  abilities?: Maybe<Array<Ability>>;
  abilitiesLite: Array<AbilityLite>;
  evolution?: Maybe<EvolutionChain>;
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  name: Scalars['String']['output'];
  stats: Stats;
  type: Array<Scalars['String']['output']>;
};

export type PokemonList = {
  offset: Scalars['Int']['output'];
  pokemon: Array<Pokemon>;
  total: Scalars['Int']['output'];
};

export type PokemonPokedex = {
  count: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type PokemonRegion = {
  count: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type PokemonType = {
  count: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type Query = {
  ability?: Maybe<Ability>;
  pokedexes: Array<PokemonPokedex>;
  pokemon?: Maybe<Pokemon>;
  pokemonByPokedex?: Maybe<PokemonList>;
  pokemonByRegion?: Maybe<PokemonList>;
  pokemonByType?: Maybe<PokemonList>;
  pokemonSearch?: Maybe<PokemonList>;
  region?: Maybe<RegionDetail>;
  regions: Array<PokemonRegion>;
  type?: Maybe<TypeDetail>;
  types: Array<PokemonType>;
};


export type QueryAbilityArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPokemonArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPokemonByPokedexArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  pokedex?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPokemonByRegionArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPokemonByTypeArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPokemonSearchArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QueryRegionArgs = {
  name: Scalars['String']['input'];
};


export type QueryTypeArgs = {
  name: Scalars['String']['input'];
};

export type RegionDetail = {
  displayName: Scalars['String']['output'];
  generation?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  locations: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  pokedexes: Array<Scalars['String']['output']>;
  pokemonCount: Scalars['Int']['output'];
  versionGroups: Array<Scalars['String']['output']>;
};

export type Stats = {
  attack: Scalars['Int']['output'];
  defense: Scalars['Int']['output'];
  hp: Scalars['Int']['output'];
  specialAttack: Scalars['Int']['output'];
  specialDefense: Scalars['Int']['output'];
  speed: Scalars['Int']['output'];
};

/**
 * How this type fares in battle, as type names. The `*To` fields are what its own
 * attacks do; the `*From` fields are what it takes.
 */
export type TypeDamageRelations = {
  doubleDamageFrom: Array<Scalars['String']['output']>;
  doubleDamageTo: Array<Scalars['String']['output']>;
  halfDamageFrom: Array<Scalars['String']['output']>;
  halfDamageTo: Array<Scalars['String']['output']>;
  noDamageFrom: Array<Scalars['String']['output']>;
  noDamageTo: Array<Scalars['String']['output']>;
};

export type TypeDetail = {
  damageRelations: TypeDamageRelations;
  displayName: Scalars['String']['output'];
  generation?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  moveCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  pokemonCount: Scalars['Int']['output'];
  /** The type's own icon, newest generation first. */
  sprite?: Maybe<Scalars['String']['output']>;
};
