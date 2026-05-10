import api from './api.js';

export const tripService = {
  async createTrip(formData) {
    const { data } = await api.post('/trips/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  async getTrips() {
    const { data } = await api.get('/trips/user');
    return data;
  },

  async getTrip(id) {
    const { data } = await api.get(`/trips/${id}`);
    return data;
  },

  async updateTrip(id, formData) {
    const { data } = await api.put(`/trips/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  async deleteTrip(id) {
    const { data } = await api.delete(`/trips/${id}`);
    return data;
  }
};
