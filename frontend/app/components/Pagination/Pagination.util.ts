export const getTotalPages = (totalItems: number, itemsPerPage: number) =>
  Math.ceil(totalItems / itemsPerPage);

export const getStartItem = (currentPage: number, itemsPerPage: number) =>
  (currentPage - 1) * itemsPerPage + 1;

export const getEndItem = (currentPage: number, itemsPerPage: number, totalItems: number) =>
  Math.min(currentPage * itemsPerPage, totalItems);
