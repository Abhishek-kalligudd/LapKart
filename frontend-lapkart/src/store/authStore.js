import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(sessionStorage.getItem('user')) || null,
  token: sessionStorage.getItem('token') || null,
  setAuth: (user, token) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },
  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    set({ user: null, token: null });
  },
}));
