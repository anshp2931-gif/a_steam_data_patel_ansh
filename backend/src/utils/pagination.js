/**
 * Reusable Pagination Utility
 * Extracts page, limit, skip, and builds metadata for pagination
 */
const getPaginationOptions = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit) || 10)); // Default 10, max 100
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const getPaginationMetadata = (totalItems, page, limit) => {
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    totalItems,
    totalPages,
    currentPage: page,
    limit,
    hasNextPage,
    hasPrevPage,
  };
};

module.exports = {
  getPaginationOptions,
  getPaginationMetadata,
};
