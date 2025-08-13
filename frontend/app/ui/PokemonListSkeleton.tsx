import React from "react";
import styles from "./PokemonList.module.css";
import PokemonCardSkeleton from "./PokemonCard/PokemonCardSkeleton";

interface PokemonListSkeletonProps {
  count?: number;
}

export default function PokemonListSkeleton({
  count = 20,
}: PokemonListSkeletonProps) {
  return (
    <div className={styles.container}>
      <div className={`${styles.heading} ${styles.skeletonHeading}`} />
      <div className={styles.grid}>
        {Array.from({ length: count }).map((_, index) => (
          <PokemonCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
