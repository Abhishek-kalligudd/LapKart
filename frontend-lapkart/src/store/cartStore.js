import { create } from 'zustand';
import { api } from '../api/axios';

export const useCartStore = create((set, get) => ({
  items: [],
  totalItems: 0,
  totalAmount: 0,
  loading: false,
  error: null,

  fetchCart: async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      set({ items: [], totalItems: 0, totalAmount: 0 });
      return;
    }

    set({ loading: true, error: null });
    try {
      const res = await api.get('/cart');
      set({
        items: res.data.items || [],
        totalItems: res.data.totalItems || 0,
        totalAmount: res.data.totalAmount || 0,
        loading: false,
      });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data || 'Failed to fetch cart',
      });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/cart/add', { productId, quantity });
      set({
        items: res.data.items || [],
        totalItems: res.data.totalItems || 0,
        totalAmount: res.data.totalAmount || 0,
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const errorMsg = typeof err.response?.data === 'string' 
        ? err.response.data 
        : err.response?.data?.message || 'Failed to add item to cart';
      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  updateQuantity: async (cartItemId, quantity) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/cart/items/${cartItemId}`, { quantity });
      set({
        items: res.data.items || [],
        totalItems: res.data.totalItems || 0,
        totalAmount: res.data.totalAmount || 0,
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const errorMsg = typeof err.response?.data === 'string' 
        ? err.response.data 
        : err.response?.data?.message || 'Failed to update quantity';
      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  removeItem: async (cartItemId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.delete(`/cart/items/${cartItemId}`);
      set({
        items: res.data.items || [],
        totalItems: res.data.totalItems || 0,
        totalAmount: res.data.totalAmount || 0,
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const errorMsg = typeof err.response?.data === 'string' 
        ? err.response.data 
        : err.response?.data?.message || 'Failed to remove item';
      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart/clear');
      set({ items: [], totalItems: 0, totalAmount: 0 });
    } catch (err) {
      // Ignore or log error
    }
  },

  reset: () => {
    set({ items: [], totalItems: 0, totalAmount: 0, error: null });
  }
}));
