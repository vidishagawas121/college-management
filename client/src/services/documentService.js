import api from './api';

export const documentService = {
  // Public
  getPublicDocuments: async (params = {}) => {
    const response = await api.get('/documents', { params });
    return response.data;
  },

  trackDownload: async (id) => {
    const response = await api.post(`/documents/${id}/download`);
    return response.data;
  },

  // Admin
  getAdminDocuments: async (params = {}) => {
    const response = await api.get('/documents/admin/all', { params });
    return response.data;
  },

  createDocument: async (data) => {
    const response = await api.post('/documents', data);
    return response.data;
  },

  updateDocument: async (id, data) => {
    const response = await api.put(`/documents/${id}`, data);
    return response.data;
  },

  deleteDocument: async (id) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },
};
