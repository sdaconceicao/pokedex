import { Suspense } from "react";
import { getPokemonById } from "@/lib/server-queries";
import PokemonDetail from "@/pokemon/[id]/components/PokemonDetail";
import PokemonDetailSkeleton from "@/pokemon/[id]/components/PokemonDetail/PokemonDetailSkeleton";
import RegionPokemonModal from "@/region/[name]/components/RegionPokemonModal";

async function PokemonDetailContent({ id }: { id: string }) {
  const pokemon = await getPokemonById(id);
  return <PokemonDetail pokemon={pokemon} />;
}

/**
 * The @detail slot for /region/[name]/pokemon/[id]. Same loader and same
 * PokemonDetail as /pokemon/[id] — this only decides where it renders.
 */
export default async function Page(props: { params: Promise<{ name: string; id: string }> }) {
  const { id } = await props.params;

  return (
    <RegionPokemonModal>
      <Suspense fallback={<PokemonDetailSkeleton />}>
        <PokemonDetailContent id={id} />
      </Suspense>
    </RegionPokemonModal>
  );
}
