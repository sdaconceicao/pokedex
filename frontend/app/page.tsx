import HomePage from "@/layout/HomePageLayout";
import { getTypes } from "@/providers/NavigationDataProvider";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    pokedex?: string;
    region?: string;
    special?: string;
    q?: string;
  }>;
}) {
  const [params, types] = await Promise.all([searchParams, getTypes()]);
  // Keeps the page hydrated on the server, but allows the search params to be updated on the client

  return (
    <HomePage
      searchQuery={params.q}
      selectedType={params.type}
      selectedPokedex={params.pokedex}
      selectedRegion={params.region}
      selectedSpecial={params.special}
      types={types}
    />
  );
}
