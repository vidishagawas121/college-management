import api from './api';

export const admissionService = {
  // Public
  getPublicAdmissions: async (params = {}) => {
    const response = await api.get('/admissions', { params });
    return response.data;
  },

  getAdmissionBySlug: async (slug) => {
    const response = await api.get(`/admissions/slug/${slug}`);
    return response.data;
  },

  // Admin
  getAdminAdmissions: async (params = {}) => {
    const response = await api.get('/admissions/admin/all', { params });
    return response.data;
  },

  createAdmission: async (data) => {
    const response = await api.post('/admissions', data);
    return response.data;
  },

  updateAdmission: async (id, data) => {
    const response = await api.put(`/admissions/${id}`, data);
    return response.data;
  },

  deleteAdmission: async (id) => {
    const response = await api.delete(`/admissions/${id}`);
    return response.data;
  },
};
