/**
 * Dynamic Filter Builder Utility
 * Automatically builds a MongoDB query object from request query parameters
 */
const buildGameFilter = (queryParams) => {
  const filter = { isDeleted: { $ne: true } }; // Exclude soft deleted games by default

  // Advanced Search (Regex match on Name, Developer, Publisher, or Description)
  if (queryParams.search) {
    const searchRegex = new RegExp(queryParams.search, "i");
    filter.$or = [
      { name: searchRegex },
      { developer: searchRegex },
      { publisher: searchRegex },
      { description: searchRegex }
    ];
  }

  // Exact matches
  if (queryParams.developer) {
    filter.developer = new RegExp(queryParams.developer, "i");
  }
  if (queryParams.publisher) {
    filter.publisher = new RegExp(queryParams.publisher, "i");
  }

  // Genre filtering (supports comma separated list like 'Action,Indie' and matches if game contains any)
  if (queryParams.genres) {
    const genreList = queryParams.genres.split(",").map(g => new RegExp(g.trim(), "i"));
    filter.genres = { $in: genreList };
  }

  // Category filtering
  if (queryParams.categories) {
    const categoryList = queryParams.categories.split(",").map(c => new RegExp(c.trim(), "i"));
    filter.categories = { $in: categoryList };
  }

  // Price range filters: ?minPrice=10&maxPrice=30
  if (queryParams.minPrice !== undefined || queryParams.maxPrice !== undefined) {
    filter.price = {};
    if (queryParams.minPrice !== undefined) {
      filter.price.$gte = parseFloat(queryParams.minPrice);
    }
    if (queryParams.maxPrice !== undefined) {
      filter.price.$lte = parseFloat(queryParams.maxPrice);
    }
  }

  // Free/Paid filter: ?isFree=true
  if (queryParams.isFree !== undefined) {
    filter.is_free = queryParams.isFree === "true";
  }

  // Platforms filter: e.g. platform=windows,mac
  if (queryParams.platforms) {
    const platformsList = queryParams.platforms.split(",").map(p => new RegExp(p.trim(), "i"));
    filter.platforms = { $in: platformsList };
  }

  // Recommendations rating filter: ?minRecommendations=1000
  if (queryParams.minRecommendations !== undefined) {
    filter.recommendations = { $gte: parseInt(queryParams.minRecommendations) };
  }

  // Release year filter: ?releaseYear=2020
  if (queryParams.releaseYear !== undefined) {
    filter.release_year = queryParams.releaseYear.toString();
  }

  return filter;
};

module.exports = {
  buildGameFilter
};
