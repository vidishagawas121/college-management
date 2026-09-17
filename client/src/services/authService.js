import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('aits_admin_token', response.data.token);
      localStorage.setItem('aits_admin_user', JSON.stringify(response.data.admin));
    }
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    if (response.data.admin) {
      localStorage.setItem('aits_admin_user', JSON.stringify(response.data.admin));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('aits_admin_token');
    localStorage.removeItem('aits_admin_user');
  },

  getCurrentAdmin: () => {
    const userStr = localStorage.getItem('aits_admin_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('aits_admin_token');
  },
};
