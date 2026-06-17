import api from './api';
import { buildQueryString } from '../utils/helpers';

const gameService = {
  getAll: async (params = {}) => {
    const query = buildQueryString(params);
    const { data } = await api.get(`/games${query}`);
    return data;
  },

  getById: async (appid) => {
    const { data } = await api.get(`/games/${appid}`);
    return data;
  },

  create: async (gameData) => {
    const { data } = await api.post('/games', gameData);
    return data;
  },

  update: async (appid, gameData) => {
    const { data } = await api.put(`/games/${appid}`, gameData);
    return data;
  },

  partialUpdate: async (appid, updates) => {
    const { data } = await api.patch(`/games/${appid}`, updates);
    return data;
  },

  delete: async (appid) => {
    const { data } = await api.delete(`/games/${appid}`);
    return data;
  },

  // Filter endpoints
  getFreeToPlay: async (params = {}) => {
    const query = buildQueryString(params);
    const { data } = await api.get(`/games/filter/free-to-play${query}`);
    return data;
  },

  getDiscounted: async (params = {}) => {
    const query = buildQueryString(params);
    const { data } = await api.get(`/games/filter/discounted${query}`);
    return data;
  },

  getByGenre: async (genre, params = {}) => {
    const query = buildQueryString(params);
    const { data } = await api.get(`/games/genre/${genre}${query}`);
    return data;
  },

  // Sub-resources
  getRelated: async (appid) => {
    const { data } = await api.get(`/games/${appid}/related`);
    return data;
  },

  getReviews: async (appid) => {
    const { data } = await api.get(`/games/${appid}/reviews`);
    return data;
  },

  addReview: async (appid, reviewData) => {
    const { data } = await api.post(`/games/${appid}/reviews`, reviewData);
    return data;
  },

  // Misc
  getRandom: async () => {
    const { data } = await api.get('/games/random');
    return data;
  },

  getTrending: async () => {
    const { data } = await api.get('/games/trending');
    return data;
  },

  getNotifications: async () => {
    const { data } = await api.get('/games/notifications');
    return data;
  },

  // Aggregation stats
  getGenreStats: async () => {
    const { data } = await api.get('/games/stats/genre');
    return data;
  },

  getPriceTierStats: async () => {
    const { data } = await api.get('/games/stats/price-tier');
    return data;
  },

  getDeveloperRankings: async () => {
    const { data } = await api.get('/games/stats/developer-rankings');
    return data;
  },

  getReleaseTrends: async () => {
    const { data } = await api.get('/games/stats/release-trends');
    return data;
  },
};

export default gameService;
