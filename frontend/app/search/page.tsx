import { Suspense } from "react";
import { buildSearchUrl, parseSearchParams } from "@/lib/searchFilters";
import { DEFAULT_SORT } from "@/lib/sort";
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
        {/* Keyed by the facets — page and sort deliberately left out — so a new
            search starts on page 1 rather than paging into the previous results,
            while reordering the current one keeps the list mounted instead of
            remounting it and throwing away the scroll position. */}
        <SearchResults
          key={buildSearchUrl({ ...filters, page: 1, sort: DEFAULT_SORT })}
          filters={filters}
        />
      </Suspense>
    </div>
  );
}
