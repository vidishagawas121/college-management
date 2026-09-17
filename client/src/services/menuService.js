import api from './api';

export const menuService = {
  getNavigationMenu: async () => {
    const response = await api.get('/menus');
    return response.data;
  },

  getAdminMenu: async () => {
    const response = await api.get('/menus/admin');
    return response.data;
  },

  updateNavigationMenu: async (items) => {
    const response = await api.put('/menus/admin', { items });
    return response.data;
  },
};
