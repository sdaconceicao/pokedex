import { Suspense } from "react";
import RouteModal from "@/components/RouteModal";
import { buildRegionUrl, parsePage } from "@/lib/regionUrls";
import { getPokemonById } from "@/lib/server-queries";
import PokemonDetail from "@/pokemon/[id]/components/PokemonDetail";
import PokemonDetailSkeleton from "@/pokemon/[id]/components/PokemonDetail/PokemonDetailSkeleton";

async function PokemonDetailContent({ id }: { id: string }) {
  const pokemon = await getPokemonById(id);
  return <PokemonDetail pokemon={pokemon} />;
}

/**
 * The @detail slot for /region/[name]/pokemon/[id]. Same loader and same
 * PokemonDetail as /pokemon/[id] — this only decides where it renders, and
 * where closing it goes: back to the region on the page it was opened from.
 */
export default async function Page(props: {
  params: Promise<{ name: string; id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ name, id }, { page }] = await Promise.all([props.params, props.searchParams]);
  const closeHref = buildRegionUrl(decodeURIComponent(name), parsePage(page));

  // No header: PokemonDetail opens with its own "Back to Results" button, and a
  // header bar with a second dismiss on top of it reads as chrome, especially
  // on mobile where the modal is a full-screen sheet.
  return (
    <RouteModal closeHref={closeHref} showCloseButton={false}>
      <Suspense fallback={<PokemonDetailSkeleton />}>
        <PokemonDetailContent id={id} />
      </Suspense>
    </RouteModal>
  );
}
