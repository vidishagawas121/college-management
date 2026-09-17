import api from './api';

export const staffService = {
  // Public
  getPublicStaff: async (params = {}) => {
    const response = await api.get('/staff', { params });
    return response.data;
  },

  getStaffBySlug: async (slug) => {
    const response = await api.get(`/staff/slug/${slug}`);
    return response.data;
  },

  // Admin
  getAdminStaff: async (params = {}) => {
    const response = await api.get('/staff/admin/all', { params });
    return response.data;
  },

  getStaffById: async (id) => {
    const response = await api.get(`/staff/admin/${id}`);
    return response.data;
  },

  createStaff: async (data) => {
    const response = await api.post('/staff', data);
    return response.data;
  },

  updateStaff: async (id, data) => {
    const response = await api.put(`/staff/${id}`, data);
    return response.data;
  },

  deleteStaff: async (id) => {
    const response = await api.delete(`/staff/${id}`);
    return response.data;
  },
};
