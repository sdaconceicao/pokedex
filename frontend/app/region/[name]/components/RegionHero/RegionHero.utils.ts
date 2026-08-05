import { titleCase } from "@/lib/string";

/** "generation-i" -> "Generation I". The numeral is Roman, so it is upper
 *  cased whole rather than run through titleCase. */
export const formatGeneration = (generation?: string | null): string | null => {
  if (!generation) return null;

  const numeral = generation.startsWith("generation-")
    ? generation.slice("generation-".length)
    : null;

  return numeral ? `Generation ${numeral.toUpperCase()}` : titleCase(generation);
};
