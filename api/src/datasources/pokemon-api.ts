import { RESTDataSource } from "@apollo/datasource-rest";
import { Ability, AbilityLite, Pokemon, Stat } from "../types";

export class PokemonAPI extends RESTDataSource {
  baseURL = "https://pokeapi.co/api/v2/";

  getPokemon(id: string): Promise<Pokemon> {
    return this.get<any>(`pokemon/${id}`).then((data) => {
      const statsObj: Stat = {
        hp: 0,
        attack: 0,
        defense: 0,
        specialAttack: 0,
        specialDefense: 0,
        speed: 0,
      };

      data.stats.forEach((stat: any) => {
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
        id: data.id,
        name: data.name,
        type: data.types.map((t: any) => t.type.name.toUpperCase()),
        image: data.sprites.front_default,
        stats: statsObj,
        abilitiesLite: data.abilities.map(
          (ability: {
            ability: { name: string; url: string };
            is_hidden: boolean;
            slot: number;
          }) => ({
            name: ability.ability.name,
            url: ability.ability.url,
            isHidden: ability.is_hidden,
            slot: ability.slot,
          })
        ),
      };
    });
  }
  getAbilities(abilitiesLite: AbilityLite[]): Promise<Ability[]> {
    return Promise.all(
      abilitiesLite.map((abilityLite) =>
        this.get<any>(abilityLite.url).then((data) => ({
          id: data.id,
          name: data.name,
          description:
            data.flavor_text_entries.find(
              (entry: any) => entry.language.name === "en"
            )?.flavor_text || "",
          effect:
            data.effect_entries.find(
              (entry: any) => entry.language.name === "en"
            )?.effect || "",
          generation: data.generation.name,
          slot: abilityLite.slot,
        }))
      )
    );
  }
}
