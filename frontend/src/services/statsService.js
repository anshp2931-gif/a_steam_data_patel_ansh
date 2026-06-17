import api from './api';

const statsService = {
  getGamesCount: async () => {
    const { data } = await api.get('/stats/games/count');
    return data;
  },

  getTopRated: async () => {
    const { data } = await api.get('/stats/games/top-rated');
    return data;
  },

  getMostDownloaded: async () => {
    const { data } = await api.get('/stats/games/most-downloaded');
    return data;
  },

  getAveragePrice: async () => {
    const { data } = await api.get('/stats/games/average-price');
    return data;
  },

  getAverageRating: async () => {
    const { data } = await api.get('/stats/games/average-rating');
    return data;
  },

  getGenreCount: async () => {
    const { data } = await api.get('/stats/games/genre-count');
    return data;
  },

  getPlatformCount: async () => {
    const { data } = await api.get('/stats/games/platform-count');
    return data;
  },

  getFreeToPlayCount: async () => {
    const { data } = await api.get('/stats/games/free-to-play-count');
    return data;
  },

  getMultiplayerCount: async () => {
    const { data } = await api.get('/stats/games/multiplayer-count');
    return data;
  },

  getMonthlyReleases: async () => {
    const { data } = await api.get('/stats/games/monthly-releases');
    return data;
  },

  // Admin analytics
  getAdminAnalytics: async () => {
    const { data } = await api.get('/admin/analytics');
    return data;
  },

  getAdminReports: async () => {
    const { data } = await api.get('/admin/reports');
    return data;
  },

  // Advanced analytics routes
  getRevenueAnalytics: async () => {
    const { data } = await api.get('/analytics/games/revenue');
    return data;
  },

  getGenreDistributionAnalytics: async () => {
    const { data } = await api.get('/analytics/games/genre-distribution');
    return data;
  },

  getPlatformDistributionAnalytics: async () => {
    const { data } = await api.get('/analytics/games/platform-distribution');
    return data;
  },

  getReleaseTrendsAnalytics: async () => {
    const { data } = await api.get('/analytics/games/release-trends');
    return data;
  },

  getUserActivityAnalytics: async () => {
    const { data } = await api.get('/analytics/games/user-activity');
    return data;
  },

  getWishlistAnalytics: async () => {
    const { data } = await api.get('/analytics/games/wishlist-analysis');
    return data;
  },

  getReviewAnalytics: async () => {
    const { data } = await api.get('/analytics/games/review-analysis');
    return data;
  },

  // Health
  getHealth: async () => {
    const { data } = await api.get('/health');
    return data;
  },
};

export default statsService;

