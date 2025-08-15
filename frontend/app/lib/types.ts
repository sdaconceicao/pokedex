export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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

export type Pokemon = {
  abilities?: Maybe<Array<Ability>>;
  abilitiesLite: Array<AbilityLite>;
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

export type Query = {
  ability?: Maybe<Ability>;
  pokedexes: Array<Scalars['String']['output']>;
  pokemon?: Maybe<Pokemon>;
  pokemonByPokedex?: Maybe<PokemonList>;
  pokemonByRegion?: Maybe<PokemonList>;
  pokemonByType?: Maybe<PokemonList>;
  pokemonSearch?: Maybe<PokemonList>;
  regions: Array<Scalars['String']['output']>;
  types: Array<Scalars['String']['output']>;
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

export type Stats = {
  attack: Scalars['Int']['output'];
  defense: Scalars['Int']['output'];
  hp: Scalars['Int']['output'];
  specialAttack: Scalars['Int']['output'];
  specialDefense: Scalars['Int']['output'];
  speed: Scalars['Int']['output'];
};
