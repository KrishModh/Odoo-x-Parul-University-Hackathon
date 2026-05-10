import api from './api.js';

export const checklistService = {
  async getChecklist(tripId) {
    const { data } = await api.get(`/checklist/${tripId}`);
    return data;
  },

  async createItem(payload) {
    const { data } = await api.post('/checklist/create', payload);
    return data;
  },

  async updateItem(payload) {
    const { data } = await api.put('/checklist/update', payload);
    return data;
  },

  async deleteItem(item_id) {
    const { data } = await api.delete('/checklist/delete', { data: { item_id } });
    return data;
  },

  async resetChecklist(tripId) {
    const { data } = await api.delete(`/checklist/reset/${tripId}`);
    return data;
  }
};
