import type { TypeResponse, TypeSprites } from "../datasources/pokemon-api.types.js";
import type { TypeDetail } from "../types.js";
import { getEnglishName } from "./region.js";

/** The newest generation PokeAPI ships type icons for. */
const PREFERRED_GENERATION = "generation-ix";

/** The type's own icon: the preferred generation's symbol if there is one, then
 *  any other generation's symbol, then a name badge as a last resort. */
export const getTypeSprite = (sprites?: TypeSprites): string | null => {
  const games = Object.values(sprites ?? {});
  const preferred = Object.values(sprites?.[PREFERRED_GENERATION] ?? {});
  const icons = [...preferred, ...games.flatMap((generation) => Object.values(generation))];

  return (
    icons.find((icon) => icon.symbol_icon)?.symbol_icon ??
    icons.find((icon) => icon.name_icon)?.name_icon ??
    null
  );
};

/** Flattens the type response into the shape the schema exposes: the nested
 *  NamedAPIResource lists become plain type names */
export const convertTypeToTypeDetail = (type: TypeResponse): TypeDetail => {
  const relations = type.damage_relations;
  const names = (resources: { name: string }[]) => resources.map(({ name }) => name);

  return {
    id: type.id.toString(),
    name: type.name,
    displayName: getEnglishName(type.names, type.name),
    generation: type.generation?.name ?? null,
    sprite: getTypeSprite(type.sprites),
    pokemonCount: type.pokemon.length,
    moveCount: type.moves.length,
    damageRelations: {
      doubleDamageTo: names(relations.double_damage_to),
      halfDamageTo: names(relations.half_damage_to),
      noDamageTo: names(relations.no_damage_to),
      doubleDamageFrom: names(relations.double_damage_from),
      halfDamageFrom: names(relations.half_damage_from),
      noDamageFrom: names(relations.no_damage_from),
    },
  };
};
