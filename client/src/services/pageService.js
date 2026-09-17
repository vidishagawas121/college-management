import api from './api';

export const pageService = {
  // Public
  getPageBySlug: async (slug) => {
    const response = await api.get(`/pages/slug/${slug}`);
    return response.data;
  },

  // Admin
  getAdminPages: async (params = {}) => {
    const response = await api.get('/pages/admin/all', { params });
    return response.data;
  },

  createPage: async (data) => {
    const response = await api.post('/pages', data);
    return response.data;
  },

  updatePage: async (id, data) => {
    const response = await api.put(`/pages/${id}`, data);
    return response.data;
  },

  deletePage: async (id) => {
    const response = await api.delete(`/pages/${id}`);
    return response.data;
  },
};
