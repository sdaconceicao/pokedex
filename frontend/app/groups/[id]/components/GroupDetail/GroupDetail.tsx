"use client";

import { useQuery } from "@apollo/client/react";
import { Alert, Button, Heading } from "@code-x/lago";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo } from "react";
import PokemonList, { PokemonListSkeleton } from "@/components/PokemonList";
import { useAuth } from "@/hooks/useAuth";
import { useGroupPokemon, useGroups } from "@/hooks/useGroups";
import { GET_POKEMON_BY_IDS } from "@/lib/queries";
import { useAuthModal } from "@/providers/AuthModalProvider";
import type { Pokemon } from "@/types";
import styles from "./GroupDetail.module.css";
import { resolveGroupDetailState, toPokemonIds } from "./GroupDetail.utils";

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { openSignIn } = useAuthModal();

  const { groups } = useGroups();
  const group = groups?.find((candidate) => candidate.id === id);

  const {
    pokemon: groupPokemon,
    isLoading: isPokemonLoading,
    error: pokemonError,
  } = useGroupPokemon(id);

  const pokemonIds = useMemo(() => toPokemonIds(groupPokemon), [groupPokemon]);

  const { loading: isDetailLoading, data } = useQuery<{ pokemonByIds: Pokemon[] }>(
    GET_POKEMON_BY_IDS,
    {
      variables: { ids: pokemonIds },
      skip: pokemonIds.length === 0,
    },
  );

  const state = resolveGroupDetailState(
    isAuthLoading,
    user,
    isPokemonLoading,
    pokemonError,
    pokemonIds,
    isDetailLoading,
  );

  let content: ReactNode;
  switch (state) {
    case "loading":
      content = <PokemonListSkeleton count={pokemonIds.length || undefined} />;
      break;
    case "signedOut":
      content = (
        <div className={styles.prompt}>
          <p>Sign in to see this list.</p>
          <Button variant="primary" onPress={openSignIn}>
            Sign In
          </Button>
        </div>
      );
      break;
    case "notFound":
      content = (
        <Alert variant="error">
          <Alert.Header
            title="List not found"
            subtitle="It may have been deleted, or it isn't yours."
          />
        </Alert>
      );
      break;
    case "empty":
      content = <p className={styles.empty}>This list doesn't have any Pokémon yet.</p>;
      break;
    case "list":
      content = <PokemonList pokemon={data?.pokemonByIds ?? []} />;
      break;
  }

  return (
    <div className={styles.container}>
      <Heading level={1}>{group?.name ?? "List"}</Heading>
      {content}
    </div>
  );
}
