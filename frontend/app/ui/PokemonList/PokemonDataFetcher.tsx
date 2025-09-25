"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_POKEMON_BY_TYPE,
  GET_POKEMON_BY_POKEDEX,
  GET_POKEMON_BY_REGION,
  SEARCH_POKEMON,
} from "@/lib/queries";
import { mapSpecialToTitle } from "@/ui/Navbar/Navbar.util";

import { Pokemon } from "@/types";
import PokemonList from "./PokemonList";

interface PokemonDataFetcherProps {
  searchQuery?: string;
  selectedType?: string;
  selectedPokedex?: string;
  selectedSpecial?: string;
  selectedRegion?: string;
}

export default function PokemonDataFetcher({
  searchQuery,
  selectedType,
  selectedPokedex,
  selectedSpecial,
  selectedRegion,
}: PokemonDataFetcherProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [total, setTotal] = useState(0);
  const [title, setTitle] = useState("");
  const [currentQueryContext, setCurrentQueryContext] = useState<string>("");
  const itemsPerPage = 20;

  // Query for Pokemon by type with pagination
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
        !selectedType || !!searchQuery || !!selectedPokedex || !!selectedRegion, // Skip if we have other queries
    }
  );

  // Query for Pokemon by pokedex with pagination
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
        !selectedPokedex || !!searchQuery || !!selectedType || !!selectedRegion, // Skip if we have other queries
    }
  );

  // Query for Pokemon by region with pagination
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
        !selectedRegion || !!searchQuery || !!selectedType || !!selectedPokedex, // Skip if we have other queries
    }
  );

  // Query for Pokemon search with pagination
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

  // Determine active query context key based on current selections
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

  // Build a unified query object for loading, error, and data
  const unifiedQuery = useMemo(() => {
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

  // Reset to first page when search, type, pokedex, or region changes
  useEffect(() => {
    // Determine the new query context
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

    // If query context changed, reset pagination and page
    if (newQueryContext !== currentQueryContext) {
      setCurrentQueryContext(newQueryContext);
      setCurrentPage(1); // Reset to first page for new query
      setTotal(0); // This will hide pagination until new data loads
    }
  }, [
    searchQuery,
    selectedSpecial,
    selectedType,
    selectedPokedex,
    selectedRegion,
    currentQueryContext,
  ]);

  useEffect(() => {
    if (activeContext && unifiedQuery?.data) {
      setPokemon(unifiedQuery.data.pokemon);
      setTotal(unifiedQuery.data.total);
      if (unifiedQuery?.title) setTitle(unifiedQuery.title);
    } else if (!activeContext) {
      setPokemon([]);
      setTotal(0);
      setTitle("");
      setCurrentQueryContext(""); // Clear query context when no query is active
    }
  }, [
    activeContext,
    unifiedQuery,
    searchQuery,
    selectedSpecial,
    selectedType,
    selectedPokedex,
    selectedRegion,
  ]);

  const loading = unifiedQuery?.loading;
  const error: string | undefined = unifiedQuery?.error?.message;

  // Only show pagination when we have a query context and data has loaded
  const shouldShowPagination = useMemo(
    () => !!currentQueryContext && total > 0,
    [currentQueryContext, total]
  );

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

  if (shouldShowInstructions) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>
          Select a Pokemon type, pokedex, or region from the sidebar or search
          for Pokemon to get started
        </p>
        <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
          Note: Search, type selection, pokedex selection, and region selection
          are separate - use one at a time
        </p>
      </div>
    );
  }

  return (
    <PokemonList
      pokemon={pokemon}
      total={total}
      title={title}
      loading={loading}
      error={error}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      itemsPerPage={itemsPerPage}
      hasQueryContext={shouldShowPagination}
    />
  );
}
