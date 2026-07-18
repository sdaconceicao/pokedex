import { useMemo } from "react";
import { PokemonCardSkeleton } from "@/components/PokemonCard";

import styles from "./PokemonList.module.css";

interface PokemonListSkeletonProps {
  count?: number;
}

export default function PokemonListSkeleton({ count = 20 }: PokemonListSkeletonProps) {
  const keys = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  return (
    <div className={styles.container}>
      <div className={`${styles.heading} ${styles.skeletonHeading}`} />
      <div className={styles.grid}>
        {keys.map((key) => (
          <PokemonCardSkeleton key={key} />
        ))}
      </div>
    </div>
  );
}
