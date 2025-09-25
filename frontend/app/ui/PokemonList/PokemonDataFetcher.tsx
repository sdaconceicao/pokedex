"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_POKEMON_BY_TYPE,
  GET_POKEMON_BY_POKEDEX,
  GET_POKEMON_BY_REGION,
  SEARCH_POKEMON,
} from "@/lib/queries";
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
    if (searchQuery) {
      // If we have a search query, use search results only
      if (searchData?.pokemonSearch) {
        setPokemon(searchData.pokemonSearch.pokemon);
        setTotal(searchData.pokemonSearch.total);
        setTitle(`Search results for "${searchQuery}"`);
      }
    } else if (selectedSpecial) {
      console.log("selectedSpecial", selectedSpecial, searchData);
      if (searchData?.pokemonSearch) {
        console.log("searchData", searchData);
        setPokemon(searchData.pokemonSearch.pokemon);
        setTotal(searchData.pokemonSearch.total);
        setTitle(`Special results for "${selectedSpecial}"`);
      }
    } else if (selectedType) {
      // If no search query but type selected, use type results only
      if (typeData?.pokemonByType) {
        setPokemon(typeData.pokemonByType.pokemon);
        setTotal(typeData.pokemonByType.total);
        setTitle(
          `Pokemon of type: ${
            selectedType.charAt(0).toUpperCase() + selectedType.slice(1)
          }`
        );
      }
    } else if (selectedPokedex) {
      // If no search query but pokedex selected, use pokedex results only
      if (pokedexData?.pokemonByPokedex) {
        setPokemon(pokedexData.pokemonByPokedex.pokemon);
        setTotal(pokedexData.pokemonByPokedex.total);
        setTitle(
          `Pokemon from pokedex: ${
            selectedPokedex.charAt(0).toUpperCase() +
            selectedPokedex.slice(1).replace(/-/g, " ")
          }`
        );
      }
    } else if (selectedRegion) {
      // If no search query but region selected, use region results only
      if (regionData?.pokemonByRegion) {
        setPokemon(regionData.pokemonByRegion.pokemon);
        setTotal(regionData.pokemonByRegion.total);
        setTitle(
          `Pokemon from region: ${
            selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1)
          }`
        );
      }
    } else {
      setPokemon([]);
      setTotal(0);
      setTitle("");
      setCurrentQueryContext(""); // Clear query context when no query is active
    }
  }, [
    searchQuery,
    selectedType,
    selectedPokedex,
    selectedRegion,
    selectedSpecial,
    searchData,
    typeData,
    pokedexData,
    regionData,
  ]);

  let loading = false;
  if (searchQuery || selectedSpecial) {
    loading = searchLoading;
  } else if (selectedType) {
    loading = typeLoading;
  } else if (selectedPokedex) {
    loading = pokedexLoading;
  } else if (selectedRegion) {
    loading = regionLoading;
  }

  let error: string | undefined;
  if (searchQuery || selectedSpecial) {
    error = searchError?.message;
  } else if (selectedType) {
    error = typeError?.message;
  } else if (selectedPokedex) {
    error = pokedexError?.message;
  } else if (selectedRegion) {
    error = regionError?.message;
  }

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
