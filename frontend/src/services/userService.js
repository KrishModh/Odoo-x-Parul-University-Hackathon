import api from './api.js';

export const userService = {
  async getProfile() {
    const { data } = await api.get('/user/profile');
    return data;
  },

  async updateProfile(formData) {
    const { data } = await api.put('/user/update-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  async updatePassword(payload) {
    const { data } = await api.put('/user/update-password', payload);
    return data;
  },

  async deleteAccount() {
    const { data } = await api.delete('/user/delete-account');
    return data;
  }
};
