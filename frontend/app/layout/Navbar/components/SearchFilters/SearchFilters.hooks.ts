"use client";

import { useApolloClient } from "@apollo/client/react";
import type { SearchSuggestion } from "@code-x/lago";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Key } from "react-aria-components";
import { GET_POKEMON_NAME_SUGGESTIONS } from "@/lib/queries";
import {
  buildSearchUrl,
  EMPTY_SEARCH_FILTERS,
  encodeDualType,
  hasActiveFilters,
  parseDualType,
  parseSearchParams,
  type SearchFilterState,
} from "@/lib/searchFilters";

/** Below this a query matches most of the dex, so the round trip buys nothing. */
const MIN_SUGGESTION_LENGTH = 2;

/** A dropdown's worth. Each row costs the backend one upstream fetch. */
const SUGGESTION_LIMIT = 8;

interface SuggestionsData {
  pokemonSearch?: { pokemon: { id: string; name: string }[] } | null;
}

export interface SearchFilterForm {
  /** The filter as edited, before it has been submitted to the URL. */
  draft: SearchFilterState;
  /** The dual-type option key, in the form the `Select` matches on. */
  dualTypeKey: string | null;
  setTypes: (value: Key[]) => void;
  setRegions: (value: Key[]) => void;
  setPokedexes: (value: Key[]) => void;
  setDualTypeKey: (value: Key | null) => void;
  setName: (value: string) => void;
  loadSuggestions: (query: string) => Promise<SearchSuggestion[]>;
  submit: () => void;
  clear: () => void;
}

const toSlugs = (value: Key[]): string[] => value.map(String);

/**
 * Holds the filter form's draft state and turns a submit into a navigation.
 *
 * The URL is the source of truth: the draft is seeded from it and re-seeded
 * whenever it changes, so landing on a link, going Back, or searching from the
 * header bar all leave the sidebar showing what is actually being filtered on.
 *
 * @returns The draft, its setters, and the submit/clear actions
 */
export function useSearchFilterForm(): SearchFilterForm {
  const router = useRouter();
  const searchParams = useSearchParams();
  const client = useApolloClient();

  const urlState = useMemo(() => parseSearchParams(searchParams), [searchParams]);
  const [draft, setDraft] = useState<SearchFilterState>(urlState);

  useEffect(() => {
    setDraft(urlState);
  }, [urlState]);

  const update = useCallback(
    <K extends keyof SearchFilterState>(key: K, value: SearchFilterState[K]) => {
      setDraft((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const setTypes = useCallback((value: Key[]) => update("types", toSlugs(value)), [update]);
  const setRegions = useCallback((value: Key[]) => update("regions", toSlugs(value)), [update]);
  const setPokedexes = useCallback((value: Key[]) => update("pokedexes", toSlugs(value)), [update]);

  // The Select's keys are the same "primary,secondary" strings the URL carries,
  // so the option round-trips through the existing parser rather than needing
  // its own encoding.
  const setDualTypeKey = useCallback(
    (value: Key | null) => update("dualType", parseDualType(value == null ? null : String(value))),
    [update],
  );

  const setName = useCallback((value: string) => update("q", value), [update]);

  // Imperative rather than useQuery: lago wants a promise per keystroke, and
  // useQuery is driven by render. It debounces the calls and discards
  // out-of-order responses, the minimum length skips the widest queries, and
  // cache-first makes a repeated prefix free.
  const loadSuggestions = useCallback(
    async (query: string): Promise<SearchSuggestion[]> => {
      const trimmed = query.trim();
      if (trimmed.length < MIN_SUGGESTION_LENGTH) return [];

      try {
        const { data } = await client.query<SuggestionsData>({
          query: GET_POKEMON_NAME_SUGGESTIONS,
          variables: { query: trimmed, limit: SUGGESTION_LIMIT },
          fetchPolicy: "cache-first",
        });

        return (data?.pokemonSearch?.pokemon ?? []).map(({ id, name }) => ({ id, label: name }));
      } catch {
        // A failed lookup means no suggestions, not a broken field — the query
        // is valid free text either way.
        return [];
      }
    },
    [client],
  );

  const submit = useCallback(() => {
    // Page 1: the old page number belongs to the old result set.
    router.push(buildSearchUrl({ ...draft, page: 1 }));
  }, [router, draft]);

  const clear = useCallback(() => {
    setDraft(EMPTY_SEARCH_FILTERS);

    // Only navigate if there was something to clear. Otherwise clearing an
    // untouched form would drag you off whatever page you were on.
    if (hasActiveFilters(urlState)) router.push("/search");
  }, [router, urlState]);

  return {
    draft,
    dualTypeKey: encodeDualType(draft.dualType) ?? null,
    setTypes,
    setRegions,
    setPokedexes,
    setDualTypeKey,
    setName,
    loadSuggestions,
    submit,
    clear,
  };
}
