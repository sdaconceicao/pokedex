import { Suspense } from "react";
import { getPokemonById } from "@/lib/server-queries";
import PokemonDetail from "@/pokemon/[id]/components/PokemonDetail";
import PokemonDetailSkeleton from "@/pokemon/[id]/components/PokemonDetail/PokemonDetailSkeleton";

interface PokemonDetailContentProps {
  id: string;
  flush?: boolean;
}

async function Detail({ id, flush }: PokemonDetailContentProps) {
  const pokemon = await getPokemonById(id);
  return <PokemonDetail pokemon={pokemon} flush={flush} />;
}

export default function PokemonDetailContent({ id, flush }: PokemonDetailContentProps) {
  return (
    <Suspense key={id} fallback={<PokemonDetailSkeleton flush={flush} />}>
      <Detail id={id} flush={flush} />
    </Suspense>
  );
}
