"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { SearchField } from "@/lib/lago";
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

  // lago's SearchField calls onSubmit with the current value directly — no
  // form event to preventDefault, and no need to read the input by ref.
  const handleSubmit = useCallback(
    (value: string) => {
      const params = new URLSearchParams();
      const trimmed = value.trim();

      if (trimmed) {
        params.set("q", trimmed);
      }

      const newUrl = params.toString() ? `/?${params.toString()}` : "/";
      router.push(newUrl);
    },
    [router],
  );

  // Fired by the field's built-in clear button once it has reset the (locally
  // controlled) value — see onChange below — so this only needs to handle the
  // navigation side effect the old hand-rolled clear button used to do.
  const handleClear = useCallback(() => {
    router.push("/");
  }, [router]);

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
