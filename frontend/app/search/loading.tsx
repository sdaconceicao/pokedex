import { SkeletonCard } from "@code-x/lago";

// Mirrors PokemonList's own card grid so the route fallback reads as "the
// Pokemon list is loading" rather than a generic spinner — the content's rough
// shape (a grid of cards) is known before any particular filter's results are.
//
// Scoped to /search rather than the app root on purpose. A loading.tsx covers
// every route below it, so at the root this grid was the first thing shown on
// the way to a Pokemon's own page too — a flash of list cards, then the detail
// skeleton. Every other route already streams its own shaped fallback through
// Suspense, so this is the only one that needs a file.
const CARD_KEYS = [0, 1, 2, 3, 4, 5, 6, 7];

export default function Loading() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 16rem), 1fr))",
        gap: "1.5rem",
      }}
    >
      {CARD_KEYS.map((key) => (
        // Only the first card is labelled — lago's Skeleton convention — so
        // the grid announces one "loading" status, not one per card.
        <SkeletonCard key={key} label={key === 0 ? "Loading Pokémon" : undefined} />
      ))}
    </div>
  );
}
