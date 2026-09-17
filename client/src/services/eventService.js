import api from './api';

export const eventService = {
  // Public
  getPublicEvents: async (params = {}) => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  getEventBySlug: async (slug) => {
    const response = await api.get(`/events/slug/${slug}`);
    return response.data;
  },

  // Admin
  getAdminEvents: async (params = {}) => {
    const response = await api.get('/events/admin/all', { params });
    return response.data;
  },

  createEvent: async (data) => {
    const response = await api.post('/events', data);
    return response.data;
  },

  updateEvent: async (id, data) => {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};
