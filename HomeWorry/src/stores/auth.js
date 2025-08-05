import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('user-token') || null,
  }),
  actions: {
    login(userData, token) {
      this.user = userData;
      this.token = token;
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('user-token', token);
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('user-token');
    },
    restore() {
      this.user = JSON.parse(localStorage.getItem('user')) || null;
      this.token = localStorage.getItem('user-token') || null;
    },
  },
});
