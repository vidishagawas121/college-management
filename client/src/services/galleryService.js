import api from './api';

export const galleryService = {
  // Public
  getPublicGalleries: async (params = {}) => {
    const response = await api.get('/gallery', { params });
    return response.data;
  },

  getGalleryBySlug: async (slug) => {
    const response = await api.get(`/gallery/slug/${slug}`);
    return response.data;
  },

  // Admin
  getAdminGalleries: async (params = {}) => {
    const response = await api.get('/gallery/admin/all', { params });
    return response.data;
  },

  createGallery: async (data) => {
    const response = await api.post('/gallery', data);
    return response.data;
  },

  updateGallery: async (id, data) => {
    const response = await api.put(`/gallery/${id}`, data);
    return response.data;
  },

  deleteGallery: async (id) => {
    const response = await api.delete(`/gallery/${id}`);
    return response.data;
  },
};
