import api from './api';

export const collegeService = {
  getCollegeInfo: async () => {
    const response = await api.get('/college');
    return response.data;
  },

  updateCollegeInfo: async (data) => {
    const response = await api.put('/college', data);
    return response.data;
  },
};
