import { redirect } from "next/navigation";
import HomeScreen from "@/layout/HomeScreen";
import { buildSearchUrl, parseLegacySearchParams } from "@/lib/searchFilters";
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

  // Every filtered list now lives at /search. The home page keeps reading the
  // params it used to answer only to forward them, so links and bookmarks from
  // before the move still land on their results.
  const legacy = parseLegacySearchParams(params);
  if (legacy) redirect(buildSearchUrl(legacy));

  return <HomeScreen types={types} />;
}
