import type { TypeResponse, TypeSprites } from "../datasources/pokemon-api.types.js";
import type { PokemonMatchups, TypeDetail } from "../types.js";
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

/**
 * What one type takes from each attacker that the chart singles out. Ordered so
 * that an immunity outranks a resistance outranks a weakness, which only matters
 * if a type ever landed in two of its own lists.
 */
const defensiveMultipliers = ({ damageRelations }: TypeDetail): Map<string, number> => {
  const multipliers = new Map<string, number>();
  for (const type of damageRelations.doubleDamageFrom) multipliers.set(type, 2);
  for (const type of damageRelations.halfDamageFrom) multipliers.set(type, 0.5);
  for (const type of damageRelations.noDamageFrom) multipliers.set(type, 0);
  return multipliers;
};

/**
 * Both halves of a Pokemon's type chart, from the one or two types it has.
 *
 * The two halves do not share arithmetic, which is the whole reason this exists:
 * defence combines multiplicatively — fire/flying takes 2x from rock twice over,
 * so 4x — while offence does not, because each type attacks on its own. Multiply
 * the offensive side and a rock/ground Pokemon reads as unable to touch flying
 * (ground's 0x times rock's 2x) when rock in fact hits it for 2x.
 */
export const buildPokemonMatchups = (types: TypeDetail[]): PokemonMatchups => {
  // Only the types some half of the chart singles out can move a product off 1x,
  // so the ones nobody mentions never need visiting: they are neutral, and
  // neutral is dropped.
  const combined = new Map<string, number>();
  for (const type of types) {
    for (const [attacker, multiplier] of defensiveMultipliers(type)) {
      // Absent from this type's lists means it trades normal damage, so a type
      // that says nothing about an attacker leaves the running product alone.
      combined.set(attacker, (combined.get(attacker) ?? 1) * multiplier);
    }
  }

  const defending = [...combined]
    .filter(([, multiplier]) => multiplier !== 1)
    // Heaviest hits first, then alphabetical, so the order is worth reading and
    // does not drift between calls
    .sort(([aType, a], [bType, b]) => b - a || aType.localeCompare(bType))
    .map(([type, multiplier]) => ({ type, multiplier }));

  // One reading per type, never merged: each type attacks on its own.
  const attacking = types.map(({ name, damageRelations }) => ({
    type: name,
    superEffective: damageRelations.doubleDamageTo,
    notVeryEffective: damageRelations.halfDamageTo,
    noEffect: damageRelations.noDamageTo,
  }));

  return { defending, attacking };
};
