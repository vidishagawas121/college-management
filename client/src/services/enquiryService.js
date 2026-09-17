import api from './api';

export const enquiryService = {
  // Public
  submitEnquiry: async (data) => {
    const response = await api.post('/enquiries', data);
    return response.data;
  },

  // Admin
  getAdminEnquiries: async (params = {}) => {
    const response = await api.get('/enquiries/admin/all', { params });
    return response.data;
  },

  updateEnquiry: async (id, data) => {
    const response = await api.put(`/enquiries/admin/${id}`, data);
    return response.data;
  },

  deleteEnquiry: async (id) => {
    const response = await api.delete(`/enquiries/admin/${id}`);
    return response.data;
  },
};
