import api from './api.js';

export const itineraryService = {
  async getItinerary(tripId) {
    const { data } = await api.get(`/itinerary/${tripId}`);
    return data;
  },

  async updateItinerary(payload) {
    const { data } = await api.put('/itinerary/update', payload);
    return data;
  },

  async getBudget(tripId) {
    const { data } = await api.get(`/budget/${tripId}`);
    return data;
  },

  async createSection(payload) {
    const { data } = await api.post('/itinerary/create-section', payload);
    return data;
  },

  async updateSection(payload) {
    const { data } = await api.put('/itinerary/update-section', payload);
    return data;
  },

  async deleteSection(section_id) {
    const { data } = await api.delete('/itinerary/delete-section', { data: { section_id } });
    return data;
  },

  async createActivity(payload) {
    const { data } = await api.post('/activities/create', payload);
    return data;
  },

  async updateActivity(payload) {
    const { data } = await api.put('/activities/update', payload);
    return data;
  },

  async deleteActivity(activity_id) {
    const { data } = await api.delete('/activities/delete', { data: { activity_id } });
    return data;
  }
};
