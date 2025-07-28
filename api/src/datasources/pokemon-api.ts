import { RESTDataSource } from "@apollo/datasource-rest";
import { Ability, AbilityLite, Pokemon, Stats, Type } from "../types";
import {
  NamedAPIResource,
  PokemonListResponse,
  PokemonIndex,
  PokemonAbility,
  PokemonEntity,
  PokemonStat,
  TypeResponse,
  TypePokemon,
} from "./pokemon-api.types";

export class PokemonAPI extends RESTDataSource {
  baseURL = "https://pokeapi.co/api/v2/";
  private static pokemonIndex: PokemonIndex[] = [];
  private static isIndexLoaded = false;

  // Retrieve id from NamedAPIResource url value
  getIndexFromUrl = (entry: NamedAPIResource) => {
    const urlParts = entry.url.replace(/\/+$/, "").split("/");
    const number = parseInt(urlParts[urlParts.length - 1], 10);
    return number;
  };

  // Request name/ids of all pokemon for search
  async loadPokemonIndex(): Promise<void> {
    if (PokemonAPI.isIndexLoaded) return;

    try {
      const response = await this.get<PokemonListResponse>(
        "pokemon?limit=1500"
      );
      const entries = response.results;

      PokemonAPI.pokemonIndex = entries
        .map((entry: NamedAPIResource) => {
          const number = this.getIndexFromUrl(entry);
          return {
            id: number.toString(),
            name: entry.name,
            number,
          };
        })
        .sort((a: PokemonIndex, b: PokemonIndex) => a.number - b.number);

      PokemonAPI.isIndexLoaded = true;
      console.log(
        `Loaded ${PokemonAPI.pokemonIndex.length} Pokémon into index`
      );
    } catch (error) {
      console.error("Failed to load Pokémon index:", error);
      throw error;
    }
  }

  // Check if index is loaded
  isIndexLoaded(): boolean {
    return PokemonAPI.isIndexLoaded;
  }

  // Fast partial string search on name
  searchPokemon(query: string, limit: number = 20): PokemonIndex[] {
    if (!PokemonAPI.isIndexLoaded) {
      throw new Error(
        "Pokemon index not loaded. Call loadPokemonIndex() first."
      );
    }

    const lowerQuery = query.toLowerCase();
    const results: PokemonIndex[] = [];

    for (const pokemon of PokemonAPI.pokemonIndex) {
      if (results.length >= limit) break;
      if (pokemon.name.toLowerCase().includes(lowerQuery)) {
        results.push(pokemon);
        continue;
      }
    }

    return results;
  }

  getPokemonByType(type: Type): Promise<PokemonIndex[]> {
    return this.get<TypeResponse>(`type/${type}`).then((data) => {
      return data.pokemon.map((result) => {
        const number = this.getIndexFromUrl(result.pokemon);
        return {
          name: result.pokemon.name,
          id: number.toString(),
          number: number,
        };
      });
    });
  }

  getPokemon(id: string): Promise<Pokemon> {
    return this.get<PokemonEntity>(`pokemon/${id}`).then((data) => {
      const statsObj: Stats = {
        hp: 0,
        attack: 0,
        defense: 0,
        specialAttack: 0,
        specialDefense: 0,
        speed: 0,
      };

      data.stats.forEach((stat: PokemonStat) => {
        switch (stat.stat.name) {
          case "hp":
            statsObj.hp = stat.base_stat;
            break;
          case "attack":
            statsObj.attack = stat.base_stat;
            break;
          case "defense":
            statsObj.defense = stat.base_stat;
            break;
          case "special-attack":
            statsObj.specialAttack = stat.base_stat;
            break;
          case "special-defense":
            statsObj.specialDefense = stat.base_stat;
            break;
          case "speed":
            statsObj.speed = stat.base_stat;
            break;
        }
      });

      return {
        id: data.id.toString(),
        name: data.name,
        type: data.types.map((t) => t.type.name.toUpperCase() as Type),
        image: data.sprites.front_default,
        stats: statsObj,
        abilitiesLite: data.abilities.map((ability) => ({
          id: ability.ability.url.split("/").filter(Boolean).pop(),
          name: ability.ability.name,
          url: ability.ability.url,
          isHidden: ability.is_hidden,
          slot: ability.slot,
        })),
      };
    });
  }
  getAbilities(abilitiesLite: AbilityLite[]): Promise<Ability[]> {
    return Promise.all(
      abilitiesLite.map((abilityLite) =>
        this.get<PokemonAbility>(abilityLite.url).then((data) => ({
          id: data.id.toString(),
          name: data.name,
          description:
            data.flavor_text_entries.find(
              (entry) => entry.language.name === "en"
            )?.flavor_text || "",
          effect:
            data.effect_entries.find((entry) => entry.language.name === "en")
              ?.effect || "",
          generation: data.generation.name,
          slot: abilityLite.slot,
        }))
      )
    );
  }
}
