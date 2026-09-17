import api from './api';

export const noticeService = {
  // Public
  getPublicNotices: async (params = {}) => {
    const response = await api.get('/notices', { params });
    return response.data;
  },

  getNoticeBySlug: async (slug) => {
    const response = await api.get(`/notices/slug/${slug}`);
    return response.data;
  },

  // Admin
  getAdminNotices: async (params = {}) => {
    const response = await api.get('/notices/admin/all', { params });
    return response.data;
  },

  createNotice: async (data) => {
    const response = await api.post('/notices', data);
    return response.data;
  },

  updateNotice: async (id, data) => {
    const response = await api.put(`/notices/${id}`, data);
    return response.data;
  },

  deleteNotice: async (id) => {
    const response = await api.delete(`/notices/${id}`);
    return response.data;
  },
};
