import api from './api.js';

export const discoveryService = {
  async getCities(params = {}) {
    const { data } = await api.get('/cities/search', { params });
    return data;
  },

  async getCity(id) {
    const { data } = await api.get(`/cities/${id}`);
    return data;
  },

  async getActivities(params = {}) {
    const { data } = await api.get('/activities/search', { params });
    return data;
  },

  async getActivity(id) {
    const { data } = await api.get(`/activities/${id}`);
    return data;
  }
};
