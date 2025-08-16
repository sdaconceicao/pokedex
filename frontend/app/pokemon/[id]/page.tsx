import { Suspense } from "react";
import { getPokemonById } from "@/lib/server-queries";
import PokemonDetail from "@/pokemon/[id]/components/PokemonDetail";
import PokemonDetailSkeleton from "@/pokemon/[id]/components/PokemonDetail/PokemonDetailSkeleton";

async function PokemonDetailContent({ id }: { id: string }) {
  const pokemon = await getPokemonById(id);
  return <PokemonDetail pokemon={pokemon} />;
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  return (
    <Suspense fallback={<PokemonDetailSkeleton />}>
      <PokemonDetailContent id={params.id} />
    </Suspense>
  );
}
