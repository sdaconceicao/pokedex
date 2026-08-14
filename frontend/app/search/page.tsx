import { Suspense } from "react";
import { buildSearchUrl, parseSearchParams } from "@/lib/searchFilters";
import SearchResults from "./components/SearchResults";
import styles from "./page.module.css";

export const metadata = {
  title: "Search",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseSearchParams(params);

  return (
    <div className={styles.container}>
      {/* SearchResults reads the page out of the URL on the client, which needs
          a boundary here or the whole route bails out of prerendering. */}
      <Suspense fallback={null}>
        {/* Keyed by the facets — page deliberately left out — so a new search
            starts on page 1 rather than paging into the previous results. */}
        <SearchResults key={buildSearchUrl({ ...filters, page: 1 })} filters={filters} />
      </Suspense>
    </div>
  );
}
