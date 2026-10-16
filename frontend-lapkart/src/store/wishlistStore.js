import { create } from 'zustand';
import { api } from '../api/axios';

const GUEST_WISHLIST_KEY = 'lapkart_guest_wishlist';

export const useWishlistStore = create((set, get) => ({
  items: [],
  wishlistIds: new Set(),
  loading: false,

  fetchWishlist: async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      // Guest mode: load from localStorage
      try {
        const stored = JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY) || '[]');
        set({
          items: stored,
          wishlistIds: new Set(stored.map(p => p.id)),
          loading: false,
        });
      } catch {
        set({ items: [], wishlistIds: new Set(), loading: false });
      }
      return;
    }

    set({ loading: true });
    try {
      const res = await api.get('/wishlist');
      const products = Array.isArray(res.data) ? res.data : [];
      set({
        items: products,
        wishlistIds: new Set(products.map(p => p.id)),
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  toggleWishlist: async (product) => {
    const token = sessionStorage.getItem('token');
    const { wishlistIds, items } = get();
    const isSaved = wishlistIds.has(product.id);

    if (!token) {
      // Guest mode
      let newItems;
      if (isSaved) {
        newItems = items.filter(p => p.id !== product.id);
      } else {
        newItems = [product, ...items];
      }
      localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(newItems));
      set({
        items: newItems,
        wishlistIds: new Set(newItems.map(p => p.id)),
      });
      return !isSaved;
    }

    // Authenticated mode: optimistic update
    const newSet = new Set(wishlistIds);
    if (isSaved) {
      newSet.delete(product.id);
      set({
        items: items.filter(p => p.id !== product.id),
        wishlistIds: newSet,
      });
    } else {
      newSet.add(product.id);
      set({
        items: [product, ...items],
        wishlistIds: newSet,
      });
    }

    try {
      const res = await api.post(`/wishlist/${product.id}/toggle`);
      return res.data?.added;
    } catch {
      // Revert on failure
      get().fetchWishlist();
      return isSaved;
    }
  },

  removeFromWishlist: async (productId) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      const stored = JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY) || '[]');
      const newItems = stored.filter(p => p.id !== productId);
      localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(newItems));
      set({
        items: newItems,
        wishlistIds: new Set(newItems.map(p => p.id)),
      });
      return;
    }

    try {
      await api.delete(`/wishlist/${productId}`);
      const newItems = get().items.filter(p => p.id !== productId);
      const newSet = new Set(get().wishlistIds);
      newSet.delete(productId);
      set({ items: newItems, wishlistIds: newSet });
    } catch (err) {
      console.error('Failed to remove from wishlist', err);
    }
  },

  mergeGuestWishlist: async () => {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    try {
      const stored = JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY) || '[]');
      if (stored.length > 0) {
        for (const item of stored) {
          try {
            await api.post(`/wishlist/${item.id}/toggle`);
          } catch {
            // Ignore individual sync errors
          }
        }
        localStorage.removeItem(GUEST_WISHLIST_KEY);
      }
      get().fetchWishlist();
    } catch (e) {
      console.error('Failed to merge guest wishlist', e);
    }
  }
}));
