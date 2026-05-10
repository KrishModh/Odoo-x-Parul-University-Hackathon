import api from './api.js';

export const authService = {
  async register(formData) {
    const { data } = await api.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  async login(credentials) {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  async verifyGoogleEmail(payload) {
    const { data } = await api.post('/auth/verify-email/google', payload);
    return data;
  },

  async me() {
    const { data } = await api.get('/auth/me');
    return data;
  }
};
