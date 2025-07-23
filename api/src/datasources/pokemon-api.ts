import { RESTDataSource } from "@apollo/datasource-rest";
import { Pokemon, Stat } from "../types";

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
      };
    });
  }
}
