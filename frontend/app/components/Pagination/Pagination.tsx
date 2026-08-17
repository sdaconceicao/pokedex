import { Pagination as LagoPagination } from "@code-x/lago";
import { useMemo } from "react";
import styles from "./Pagination.module.css";
import { getEndItem, getStartItem, getTotalPages } from "./Pagination.util";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

/** The floating bar under a Pokemon list. Keeps the app's own page/items
 *  props so its call sites don't change, and hands the truncation — which
 *  page numbers to show, where the ellipsis goes — to lago's Pagination. */
export default function Pagination({
  currentPage,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const startItem = useMemo(
    () => getStartItem(currentPage, itemsPerPage),
    [currentPage, itemsPerPage],
  );
  const endItem = useMemo(
    () => getEndItem(currentPage, itemsPerPage, totalItems),
    [currentPage, itemsPerPage, totalItems],
  );
  const totalPages = useMemo(
    () => getTotalPages(totalItems, itemsPerPage),
    [totalItems, itemsPerPage],
  );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        Showing {startItem}-{endItem} of {totalItems} Pokemon
      </div>

      <LagoPagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        aria-label="Pokemon pagination"
        className={styles.nav}
      />
    </div>
  );
}
