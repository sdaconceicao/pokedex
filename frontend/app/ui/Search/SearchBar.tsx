"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchSm, XCircle } from "@untitled-ui/icons-react";

import Button from "@/ui/Button";
import Input from "@/ui/Input";
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
    [router, searchQuery]
  );

  const handleClear = useCallback(() => {
    setSearchQuery("");
    router.push("/");
  }, [setSearchQuery, router]);

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Pokemon..."
          className={styles.searchInput}
        />
        <Button type="submit" variant="primary" className={styles.searchButton}>
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
