export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Steam Games Dashboard';

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const STORAGE_KEYS = {
  TOKEN: 'steam_auth_token',
  THEME: 'steam_theme',
  USER: 'steam_user',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMITS: [5, 10, 25, 50],
};

export const GAME_GENRES = [
  'Action', 'Adventure', 'RPG', 'Strategy', 'Simulation',
  'Sports', 'Racing', 'Puzzle', 'Indie', 'Horror',
  'Survival', 'Shooter', 'Platformer', 'Fighting', 'Casual',
];

export const GAME_PLATFORMS = ['windows', 'mac', 'linux'];

export const PRICE_TIERS = [
  { label: 'Free to Play', value: 'free' },
  { label: 'Under $15', value: 'budget' },
  { label: '$15 - $40', value: 'premium' },
  { label: 'Over $40', value: 'elite' },
];
