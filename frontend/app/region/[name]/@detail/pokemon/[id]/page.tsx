import { Suspense } from "react";
import RouteModal from "@/components/RouteModal";
import { buildBrowseUrl } from "@/lib/browseUrls";
import { parsePage } from "@/lib/pagination";
import { getPokemonById } from "@/lib/server-queries";
import { parseSort } from "@/lib/sort";
import PokemonDetail from "@/pokemon/[id]/components/PokemonDetail";
import PokemonDetailSkeleton from "@/pokemon/[id]/components/PokemonDetail/PokemonDetailSkeleton";

async function PokemonDetailContent({ id }: { id: string }) {
  const pokemon = await getPokemonById(id);
  return <PokemonDetail pokemon={pokemon} flush />;
}

/**
 * The @detail slot for /region/[name]/pokemon/[id]. Same loader and same
 * PokemonDetail as /pokemon/[id] — this only decides where it renders, and
 * where closing it goes: back to the region on the page it was opened from.
 */
export default async function Page(props: {
  params: Promise<{ name: string; id: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}) {
  const [{ name, id }, { page, sort }] = await Promise.all([props.params, props.searchParams]);
  const closeHref = buildBrowseUrl("region", decodeURIComponent(name), {
    page: parsePage(page),
    sort: parseSort(sort),
  });

  // No header: PokemonDetail opens with its own "Back" button, and a header bar
  // with a second dismiss on top of it reads as chrome, especially on mobile
  // where the modal is a full-screen sheet.
  return (
    <RouteModal closeHref={closeHref} showCloseButton={false}>
      <Suspense fallback={<PokemonDetailSkeleton flush />}>
        <PokemonDetailContent id={id} />
      </Suspense>
    </RouteModal>
  );
}
