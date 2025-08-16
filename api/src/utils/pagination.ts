export const getPaginatedResults = (
  results: unknown[],
  limit: number,
  offset: number
) => {
  if (!Array.isArray(results)) {
    return [];
  }

  const safeOffset = Math.max(0, offset);
  const safeLimit = limit > 0 ? limit : 0;

  // If limit is 0 or negative, return all results from offset
  if (safeLimit === 0) {
    return results.slice(safeOffset);
  }

  // Return paginated results with limit
  return results.slice(safeOffset, safeOffset + safeLimit);
};
