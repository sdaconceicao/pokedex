import {
  PokemonAbility,
  PokemonEntity,
  PokemonStat,
} from "../datasources/pokemon-api.types";
import { AbilityLite, Pokemon, Stats } from "../types";

export const getPokemonAbilitiesLite = (pokemon: PokemonEntity) => {
  return pokemon.abilities.map((ability) => ({
    id: ability.ability.url.split("/").filter(Boolean).pop(),
    name: ability.ability.name,
    url: ability.ability.url,
    isHidden: ability.is_hidden,
    slot: ability.slot,
  }));
};

export const getPokemonDefaultImageUrl = (pokemon: PokemonEntity) => {
  let imageUrl = pokemon.sprites.front_default;

  if (!imageUrl) {
    // Try alternative sprites in order of preference
    const fallbackSprites = [
      pokemon.sprites.front_shiny,
      pokemon.sprites.back_default,
      pokemon.sprites.back_shiny,
      pokemon.sprites.other?.["official-artwork"]?.front_default,
      pokemon.sprites.other?.["official-artwork"]?.front_shiny,
      pokemon.sprites.other?.home?.front_default,
      pokemon.sprites.other?.home?.front_shiny,
      pokemon.sprites.other?.dream_world?.front_default,
      pokemon.sprites.other?.showdown?.front_default,
    ];

    imageUrl = fallbackSprites.find(
      (sprite) => sprite !== null && sprite !== undefined
    );
  }

  // If still no image, use a placeholder or throw an error
  if (!imageUrl) {
    imageUrl = `https://dummyimage.com/96x96/f0f0f0/666666.png&text=${encodeURIComponent(
      pokemon.name
    )}`;
  }
  return imageUrl;
};

export const getPokemonTypes = (pokemon: PokemonEntity) => {
  return pokemon.types.map((t) => t.type.name);
};

export const getPokemonStats = (pokemon: PokemonEntity) => {
  const statsObj: Stats = {
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0,
  };

  pokemon.stats.forEach((stat: PokemonStat) => {
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
  return statsObj;
};

export const convertAbilityLiteToAbility = (
  data: PokemonAbility,
  abilityLite: AbilityLite
) => {
  return {
    id: data.id.toString(),
    name: data.name,
    description:
      data.flavor_text_entries.find((entry) => entry.language.name === "en")
        ?.flavor_text || "",
    effect:
      data.effect_entries.find((entry) => entry.language.name === "en")
        ?.effect || "",
    generation: data.generation.name,
    slot: abilityLite.slot,
  };
};

export const convertPokemonEntityToPokemon = (
  pokemon: PokemonEntity
): Pokemon => {
  return {
    id: pokemon.id.toString(),
    name: pokemon.name,
    type: getPokemonTypes(pokemon),
    image: getPokemonDefaultImageUrl(pokemon),
    stats: getPokemonStats(pokemon),
    abilitiesLite: getPokemonAbilitiesLite(pokemon),
  };
};
