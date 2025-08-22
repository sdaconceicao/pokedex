import React, { useCallback, useMemo } from "react";
import {
  getStartItem,
  getEndItem,
  getPageNumbers,
  getTotalPages,
} from "./Pagination.util";
import Button from "@/ui/Button";

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
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          variant="primary"
          size="sm"
          className={styles.previousNext}
        >
          Previous
        </Button>

        <div className={styles.pageNumbers}>
          {pageNumbers.map((page, index) => (
            <Button
              key={index}
              onClick={() => typeof page === "number" && handlePageClick(page)}
              variant={page === currentPage ? "primary" : "outline"}
              size="sm"
              disabled={typeof page === "string"}
              className={`${typeof page === "string" ? styles.ellipsis : ""}`}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          variant="primary"
          size="sm"
          className={styles.previousNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
