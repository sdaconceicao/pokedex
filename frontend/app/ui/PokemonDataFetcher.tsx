"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_POKEMON_BY_TYPE, SEARCH_POKEMON } from "../lib/queries";
import { Pokemon, PokemonByTypeData, PokemonSearchData } from "../lib/types";
import PokemonList from "./PokemonList";

interface PokemonDataFetcherProps {
  searchQuery?: string;
  selectedType?: string;
}

export default function PokemonDataFetcher({
  searchQuery,
  selectedType,
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
    skip: !selectedType || !!searchQuery, // Skip if we have a search query
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

  // Reset to first page when search or type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType]);

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
    } else {
      setPokemon([]);
      setTotal(0);
      setTitle("");
    }
  }, [searchQuery, selectedType, searchData, typeData]);

  const loading = searchQuery ? searchLoading : typeLoading;
  const error = searchQuery ? searchError?.message : typeError?.message;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!searchQuery && !selectedType) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>
          Select a Pokemon type from the sidebar or search for Pokemon to get
          started
        </p>
        <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
          Note: Search and type selection are separate - use one or the other
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
