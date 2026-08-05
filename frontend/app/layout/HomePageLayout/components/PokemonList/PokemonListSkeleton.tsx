import { useMemo } from "react";
import { PokemonCardSkeleton } from "@/components/PokemonCard";

import styles from "./PokemonList.module.css";

interface PokemonListSkeletonProps {
  count?: number;
}

export default function PokemonListSkeleton({ count = 20 }: PokemonListSkeletonProps) {
  const keys = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  // Just the grid: the caller owns the container and renders the real heading,
  // whose text comes from the URL and so needs no placeholder.
  return (
    <div className={styles.grid}>
      {keys.map((key) => (
        <PokemonCardSkeleton key={key} />
      ))}
    </div>
  );
}
