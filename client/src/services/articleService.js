import api from './api';

export const articleService = {
  // Public
  getPublicArticles: async (params = {}) => {
    const response = await api.get('/articles', { params });
    return response.data;
  },

  getArticleBySlug: async (slug) => {
    const response = await api.get(`/articles/slug/${slug}`);
    return response.data;
  },

  // Admin
  getAdminArticles: async (params = {}) => {
    const response = await api.get('/articles/admin/all', { params });
    return response.data;
  },

  createArticle: async (data) => {
    const response = await api.post('/articles', data);
    return response.data;
  },

  updateArticle: async (id, data) => {
    const response = await api.put(`/articles/${id}`, data);
    return response.data;
  },

  deleteArticle: async (id) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  },
};
