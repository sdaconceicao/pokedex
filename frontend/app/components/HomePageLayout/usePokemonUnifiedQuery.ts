"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_POKEMON_BY_TYPE,
  GET_POKEMON_BY_POKEDEX,
  GET_POKEMON_BY_REGION,
  SEARCH_POKEMON,
} from "@/lib/queries";
import { Pokemon } from "@/types";
import { mapSpecialToTitle } from "@/ui/Navbar/Navbar.util";

export interface UnifiedPokemonQuery {
  loading: boolean;
  error?: Error;
  data?: { pokemon: Pokemon[]; total: number };
  title?: string;
  currentQueryContext: string;
  page: number;
  setPage: (page: number) => void;
  itemsPerPage: number;
  shouldShowInstructions: boolean;
  shouldShowPagination: boolean;
}

interface Params {
  searchQuery?: string;
  selectedType?: string;
  selectedPokedex?: string;
  selectedSpecial?: string;
  selectedRegion?: string;
}

export function usePokemonUnifiedQuery({
  searchQuery,
  selectedType,
  selectedPokedex,
  selectedSpecial,
  selectedRegion,
}: Params): UnifiedPokemonQuery {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQueryContext, setCurrentQueryContext] = useState<string>("");
  const itemsPerPage = 20;

  const {
    loading: typeLoading,
    error: typeError,
    data: typeData,
  } = useQuery<{ pokemonByType: { pokemon: Pokemon[]; total: number } }>(
    GET_POKEMON_BY_TYPE,
    {
      variables: {
        type: selectedType,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      },
      skip:
        !selectedType || !!searchQuery || !!selectedPokedex || !!selectedRegion,
    }
  );

  const {
    loading: pokedexLoading,
    error: pokedexError,
    data: pokedexData,
  } = useQuery<{ pokemonByPokedex: { pokemon: Pokemon[]; total: number } }>(
    GET_POKEMON_BY_POKEDEX,
    {
      variables: {
        pokedex: selectedPokedex,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      },
      skip:
        !selectedPokedex || !!searchQuery || !!selectedType || !!selectedRegion,
    }
  );

  const {
    loading: regionLoading,
    error: regionError,
    data: regionData,
  } = useQuery<{ pokemonByRegion: { pokemon: Pokemon[]; total: number } }>(
    GET_POKEMON_BY_REGION,
    {
      variables: {
        region: selectedRegion,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      },
      skip:
        !selectedRegion || !!searchQuery || !!selectedType || !!selectedPokedex,
    }
  );

  const {
    loading: searchLoading,
    error: searchError,
    data: searchData,
  } = useQuery<{ pokemonSearch: { pokemon: Pokemon[]; total: number } }>(
    SEARCH_POKEMON,
    {
      variables: {
        query: searchQuery || selectedSpecial || "",
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      },
      skip: !searchQuery && !selectedSpecial,
    }
  );

  const activeContext = useMemo<
    "search" | "special" | "type" | "pokedex" | "region" | null
  >(() => {
    if (searchQuery) return "search";
    if (selectedSpecial) return "special";
    if (selectedType) return "type";
    if (selectedPokedex) return "pokedex";
    if (selectedRegion) return "region";
    return null;
  }, [
    searchQuery,
    selectedSpecial,
    selectedType,
    selectedPokedex,
    selectedRegion,
  ]);

  useEffect(() => {
    let newQueryContext = "";
    if (searchQuery) {
      newQueryContext = `search:${searchQuery}`;
    } else if (selectedType) {
      newQueryContext = `type:${selectedType}`;
    } else if (selectedPokedex) {
      newQueryContext = `pokedex:${selectedPokedex}`;
    } else if (selectedRegion) {
      newQueryContext = `region:${selectedRegion}`;
    } else if (selectedSpecial) {
      newQueryContext = `special:${selectedSpecial}`;
    }

    if (newQueryContext !== currentQueryContext) {
      setCurrentQueryContext(newQueryContext);
      setCurrentPage(1);
    }
  }, [
    searchQuery,
    selectedSpecial,
    selectedType,
    selectedPokedex,
    selectedRegion,
    currentQueryContext,
  ]);

  const unified = useMemo(() => {
    switch (activeContext) {
      case "search":
        return {
          loading: searchLoading,
          error: searchError,
          data: searchData?.pokemonSearch,
          title: `Search results for "${searchQuery ?? ""}"`,
        } as const;
      case "special":
        return {
          loading: searchLoading,
          error: searchError,
          data: searchData?.pokemonSearch,
          title: `${mapSpecialToTitle(selectedSpecial ?? "")} Pokemon`,
        } as const;
      case "type":
        return {
          loading: typeLoading,
          error: typeError,
          data: typeData?.pokemonByType,
          title: `Pokemon of type: ${
            selectedType
              ? selectedType.charAt(0).toUpperCase() + selectedType.slice(1)
              : ""
          }`,
        } as const;
      case "pokedex":
        return {
          loading: pokedexLoading,
          error: pokedexError,
          data: pokedexData?.pokemonByPokedex,
          title: (() => {
            const display = selectedPokedex
              ? selectedPokedex.charAt(0).toUpperCase() +
                selectedPokedex.slice(1).replace(/-/g, " ")
              : "";
            return `Pokemon from pokedex: ${display}`;
          })(),
        } as const;
      case "region":
        return {
          loading: regionLoading,
          error: regionError,
          data: regionData?.pokemonByRegion,
          title: `Pokemon from region: ${
            selectedRegion
              ? selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1)
              : ""
          }`,
        } as const;
      default:
        return {
          loading: false,
          error: undefined,
          data: undefined,
          title: undefined,
        } as const;
    }
  }, [
    activeContext,
    searchLoading,
    searchError,
    searchData,
    typeLoading,
    typeError,
    typeData,
    pokedexLoading,
    pokedexError,
    pokedexData,
    regionLoading,
    regionError,
    regionData,
    searchQuery,
    selectedSpecial,
    selectedType,
    selectedPokedex,
    selectedRegion,
  ]);

  const shouldShowInstructions = useMemo(
    () =>
      !searchQuery &&
      !selectedType &&
      !selectedPokedex &&
      !selectedRegion &&
      !selectedSpecial,
    [
      searchQuery,
      selectedType,
      selectedPokedex,
      selectedRegion,
      selectedSpecial,
    ]
  );

  // Only show pagination when we have a query context and data has loaded
  const shouldShowPagination = useMemo(
    () => !!currentQueryContext && !!unified.data && unified?.data?.total > 0,
    [currentQueryContext, unified.data]
  );

  return {
    loading: unified.loading,
    error: unified.error,
    data: unified.data,
    title: unified.title,
    currentQueryContext,
    page: currentPage,
    setPage: setCurrentPage,
    itemsPerPage,
    shouldShowInstructions,
    shouldShowPagination,
  };
}
