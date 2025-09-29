import HomaePage from "@/components/HomePage";

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

  return (
    <HomaePage
      searchQuery={params.q}
      selectedType={params.type}
      selectedPokedex={params.pokedex}
      selectedRegion={params.region}
      selectedSpecial={params.special}
    />
  );
}
