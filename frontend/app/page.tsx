import HomePage from "@/ui/HomePageLayout";

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
  const params = await searchParams;
  // Keeps the page hydrated on the server, but allows the search params to be updated on the client

  return (
    <HomePage
      searchQuery={params.q}
      selectedType={params.type}
      selectedPokedex={params.pokedex}
      selectedRegion={params.region}
      selectedSpecial={params.special}
    />
  );
}
