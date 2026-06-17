import api from './api';

const authService = {
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  logout: async () => {
    const { data } = await api.post('/auth/logout');
    return data;
  },

  getProfile: async () => {
    const { data } = await api.get('/auth/profile');
    return data;
  },

  updateProfile: async (updates) => {
    const { data } = await api.patch('/auth/profile', updates);
    return data;
  },

  changePassword: async (passwords) => {
    const { data } = await api.post('/auth/change-password', passwords);
    return data;
  },

  forgotPassword: async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  resetPassword: async (resetData) => {
    const { data } = await api.post('/auth/reset-password', resetData);
    return data;
  },
};

export default authService;
