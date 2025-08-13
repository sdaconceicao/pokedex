import React, { useCallback, useMemo } from "react";
import {
  getStartItem,
  getEndItem,
  getPageNumbers,
  getTotalPages,
} from "./Pagination.util";

import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function Pagination({
  currentPage,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const startItem = useMemo(
    () => getStartItem(currentPage, itemsPerPage),
    [currentPage, itemsPerPage]
  );
  const endItem = useMemo(
    () => getEndItem(currentPage, itemsPerPage, totalItems),
    [currentPage, itemsPerPage, totalItems]
  );
  const totalPages = useMemo(
    () => getTotalPages(totalItems, itemsPerPage),
    [totalItems, itemsPerPage]
  );
  const pageNumbers = useMemo(
    () => getPageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [onPageChange, currentPage, totalPages]);

  const handlePageClick = useCallback(
    (page: number) => {
      onPageChange(page);
    },
    [onPageChange]
  );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        Showing {startItem}-{endItem} of {totalItems} Pokemon
      </div>

      <div className={styles.controls}>
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`${styles.button} ${styles.previousNext}`}
        >
          Previous
        </button>

        <div className={styles.pageNumbers}>
          {pageNumbers.map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && handlePageClick(page)}
              className={`${styles.button} ${styles.pageButton} ${
                page === currentPage ? styles.active : ""
              } ${typeof page === "string" ? styles.ellipsis : ""}`}
              disabled={typeof page === "string"}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`${styles.button} ${styles.previousNext}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
