import { create } from 'zustand';
import { useCartStore } from './cartStore';
import { useWishlistStore } from './wishlistStore';

export const useAuthStore = create((set) => ({
  user: JSON.parse(sessionStorage.getItem('user')) || null,
  token: sessionStorage.getItem('token') || null,

  setAuth: (user, token) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    set({ user, token });

    // Automatically merge guest cart & wishlist to database
    setTimeout(() => {
      useCartStore.getState().mergeGuestCart();
      useWishlistStore.getState().mergeGuestWishlist();
    }, 100);
  },

  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    set({ user: null, token: null });
    useCartStore.getState().reset();
    useWishlistStore.getState().fetchWishlist();
  },
}));
