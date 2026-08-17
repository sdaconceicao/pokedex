"use client";

import { SearchField } from "@code-x/lago";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { buildSearchUrl, hasActiveFilters, parseSearchParams } from "@/lib/searchFilters";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize search query from URL params
  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
  }, [searchParams]);

  // The name is one facet of the same filter the sidebar drives, so setting it
  // from here keeps whatever else is already selected rather than replacing it,
  // and only resets the page — the old page number belongs to the old results.
  // With nothing left to filter on there is nothing to show, so that goes home
  // rather than to a results page listing the entire dex.
  const goToResults = useCallback(
    (q: string) => {
      const next = { ...parseSearchParams(searchParams), q, page: 1 };
      router.push(hasActiveFilters(next) ? buildSearchUrl(next) : "/");
    },
    [router, searchParams],
  );

  // lago's SearchField calls onSubmit with the current value directly — no
  // form event to preventDefault, and no need to read the input by ref.
  const handleSubmit = useCallback((value: string) => goToResults(value), [goToResults]);

  // Fired by the field's built-in clear button once it has reset the (locally
  // controlled) value — see onChange below — so this only needs to handle the
  // navigation side effect the old hand-rolled clear button used to do. It
  // clears the name, not the whole filter, so any facets the sidebar set stay.
  const handleClear = useCallback(() => goToResults(""), [goToResults]);

  return (
    <SearchField
      aria-label="Search Pokemon"
      placeholder="Search Pokemon..."
      value={searchQuery}
      onChange={setSearchQuery}
      onSubmit={handleSubmit}
      onClear={handleClear}
      className={styles.searchField}
    />
  );
}
