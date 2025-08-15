import { PokemonDataFetcher } from "@/ui/PokemonList";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    pokedex?: string;
    region?: string;
    q?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <PokemonDataFetcher
      searchQuery={params.q}
      selectedType={params.type}
      selectedPokedex={params.pokedex}
      selectedRegion={params.region}
    />
  );
}
