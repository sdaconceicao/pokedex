export const getTotalPages = (totalItems: number, itemsPerPage: number) =>
  Math.ceil(totalItems / itemsPerPage);

export const getStartItem = (currentPage: number, itemsPerPage: number) =>
  (currentPage - 1) * itemsPerPage + 1;

export const getEndItem = (
  currentPage: number,
  itemsPerPage: number,
  totalItems: number
) => Math.min(currentPage * itemsPerPage, totalItems);

export const getPageNumbers = (currentPage: number, totalPages: number) => {
  const pages = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    }
  }

  return pages;
};
