import api from './api.js';

export const journalService = {
  async getJournal(tripId) {
    const { data } = await api.get(`/journal/${tripId}`);
    return data;
  },

  async createNote(payload) {
    const { data } = await api.post('/journal/create', payload);
    return data;
  },

  async updateNote(payload) {
    const { data } = await api.put('/journal/update', payload);
    return data;
  },

  async deleteNote(note_id) {
    const { data } = await api.delete('/journal/delete', { data: { note_id } });
    return data;
  }
};
