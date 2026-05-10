import api from './api.js';

export const shareService = {
  async generateShare(trip_id) {
    const { data } = await api.post('/share/generate', { trip_id });
    return data;
  },

  async getShared(slug) {
    const { data } = await api.get(`/share/${slug}`);
    return data;
  },

  async copyShared(slug) {
    const { data } = await api.post(`/share/${slug}/copy`);
    return data;
  }
};
