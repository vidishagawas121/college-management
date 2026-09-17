import api from './api';

export const departmentService = {
  // Public
  getPublicDepartments: async (params = {}) => {
    const response = await api.get('/departments', { params });
    return response.data;
  },

  getDepartmentBySlug: async (slug) => {
    const response = await api.get(`/departments/slug/${slug}`);
    return response.data;
  },

  // Admin
  getAdminDepartments: async (params = {}) => {
    const response = await api.get('/departments/admin/all', { params });
    return response.data;
  },

  getDepartmentById: async (id) => {
    const response = await api.get(`/departments/admin/${id}`);
    return response.data;
  },

  createDepartment: async (data) => {
    const response = await api.post('/departments', data);
    return response.data;
  },

  updateDepartment: async (id, data) => {
    const response = await api.put(`/departments/${id}`, data);
    return response.data;
  },

  deleteDepartment: async (id) => {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  },
};
