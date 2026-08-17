import { buildPokemonPath } from "@/lib/pokemonUrls";

const DETAIL_TAIL = /\/pokemon\/[^/]+(?:\/forms\/[^/]+)?\/?$/;

interface FormTarget {
  speciesId: string;
  formId: string;
}

export const buildFormHref = (
  pathname: string,
  search: string,
  { speciesId, formId }: FormTarget,
): string => {
  const tail = buildPokemonPath(speciesId, formId);

  if (!DETAIL_TAIL.test(pathname)) return tail;

  const path = pathname.replace(DETAIL_TAIL, tail);
  const query = search.replace(/^\?/, "");

  return query ? `${path}?${query}` : path;
};
