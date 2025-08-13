"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_POKEMON_BY_TYPE,
  GET_POKEMON_BY_POKEDEX,
  GET_POKEMON_BY_REGION,
  SEARCH_POKEMON,
} from "../lib/queries";
import {
  Pokemon,
  PokemonByTypeData,
  PokemonByPokedexData,
  PokemonByRegionData,
  PokemonSearchData,
} from "../lib/types";
import PokemonList from "./PokemonList";

interface PokemonDataFetcherProps {
  searchQuery?: string;
  selectedType?: string;
  selectedPokedex?: string;
  selectedRegion?: string;
}

export default function PokemonDataFetcher({
  searchQuery,
  selectedType,
  selectedPokedex,
  selectedRegion,
}: PokemonDataFetcherProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [total, setTotal] = useState(0);
  const [title, setTitle] = useState("");
  const itemsPerPage = 20;

  // Query for Pokemon by type with pagination
  const {
    loading: typeLoading,
    error: typeError,
    data: typeData,
  } = useQuery<PokemonByTypeData>(GET_POKEMON_BY_TYPE, {
    variables: {
      type: selectedType,
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    },
    skip:
      !selectedType || !!searchQuery || !!selectedPokedex || !!selectedRegion, // Skip if we have other queries
  });

  // Query for Pokemon by pokedex with pagination
  const {
    loading: pokedexLoading,
    error: pokedexError,
    data: pokedexData,
  } = useQuery<PokemonByPokedexData>(GET_POKEMON_BY_POKEDEX, {
    variables: {
      pokedex: selectedPokedex,
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    },
    skip:
      !selectedPokedex || !!searchQuery || !!selectedType || !!selectedRegion, // Skip if we have other queries
  });

  // Query for Pokemon by region with pagination
  const {
    loading: regionLoading,
    error: regionError,
    data: regionData,
  } = useQuery<PokemonByRegionData>(GET_POKEMON_BY_REGION, {
    variables: {
      region: selectedRegion,
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    },
    skip:
      !selectedRegion || !!searchQuery || !!selectedType || !!selectedPokedex, // Skip if we have other queries
  });

  // Query for Pokemon search with pagination
  const {
    loading: searchLoading,
    error: searchError,
    data: searchData,
  } = useQuery<PokemonSearchData>(SEARCH_POKEMON, {
    variables: {
      query: searchQuery || "",
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    },
    skip: !searchQuery,
  });

  // Reset to first page when search, type, pokedex, or region changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedPokedex, selectedRegion]);

  useEffect(() => {
    if (searchQuery) {
      // If we have a search query, use search results only
      if (searchData?.pokemonSearch) {
        setPokemon(searchData.pokemonSearch.pokemon);
        setTotal(searchData.pokemonSearch.total);
        setTitle(`Search results for "${searchQuery}"`);
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
    }
  }, [
    searchQuery,
    selectedType,
    selectedPokedex,
    selectedRegion,
    searchData,
    typeData,
    pokedexData,
    regionData,
  ]);

  const loading = searchQuery
    ? searchLoading
    : selectedType
    ? typeLoading
    : selectedPokedex
    ? pokedexLoading
    : regionLoading;
  const error = searchQuery
    ? searchError?.message
    : selectedType
    ? typeError?.message
    : selectedPokedex
    ? pokedexError?.message
    : regionError?.message;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!searchQuery && !selectedType && !selectedPokedex && !selectedRegion) {
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
      onPageChange={handlePageChange}
      itemsPerPage={itemsPerPage}
    />
  );
}
