import { capitalize } from "./string";

const FORM_LABELS: Record<string, string> = {
  gmax: "Gigantamax",
  alola: "Alolan",
  galar: "Galarian",
  hisui: "Hisuian",
  paldea: "Paldean",
};

const DEFAULT_FORM_LABEL = "Default";

const toLabel = (slug: string): string =>
  slug
    .split("-")
    .filter(Boolean)
    .map((token) => FORM_LABELS[token] ?? capitalize(token))
    .join(" ");

export const formatFormName = (name: string, speciesName?: string): string => {
  if (!name) return name;
  if (!speciesName) return toLabel(name);

  if (name === speciesName) return DEFAULT_FORM_LABEL;

  const prefix = `${speciesName}-`;
  if (!name.startsWith(prefix)) return toLabel(name);

  return toLabel(name.slice(prefix.length));
};

interface NameablePokemon {
  id: string;
  speciesId: string;
  speciesName: string;
  name: string;
}

export const formatPokemonName = ({ id, speciesId, speciesName, name }: NameablePokemon): string =>
  id === speciesId ? formatFormName(speciesName) : formatFormName(name);
