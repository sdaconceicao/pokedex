"use client";

import { SearchSm, XCircle } from "@untitled-ui/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useState } from "react";

import Button from "@/components/Button";
import Input from "@/components/Input";
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

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const params = new URLSearchParams();

      if (searchQuery.trim()) {
        params.set("q", searchQuery.trim());
      }

      const newUrl = params.toString() ? `/?${params.toString()}` : "/";
      router.push(newUrl);
    },
    [router, searchQuery],
  );

  const handleClear = useCallback(() => {
    setSearchQuery("");
    router.push("/");
  }, [router]);

  return (
    <div className={styles.searchBar}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <Input
          type="text"
          size="md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Pokemon..."
          wrapperClassName={styles.searchField}
          className={styles.searchInput}
        />
        <Button type="submit" size="md" variant="primary" className={styles.searchButton}>
          <SearchSm aria-label="Search" />
        </Button>
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleClear}
            className={styles.clearButton}
          >
            <XCircle aria-label="Clear search" />
          </Button>
        )}
      </form>
    </div>
  );
}
