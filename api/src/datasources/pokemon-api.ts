import { RESTDataSource } from "@apollo/datasource-rest";
import { Pokemon } from "../types";

export class PokemonAPI extends RESTDataSource {
  baseURL = "https://pokeapi.co/api/v2/";

  getPokemon(id: string): Promise<Pokemon> {
    return this.get<Pokemon>("pokemon/${id}");
  }
}
