import { create } from 'zustand';
import { api } from '../api/axios';

const GUEST_CART_KEY = 'lapkart_guest_cart';

export const useCartStore = create((set, get) => ({
  items: [],
  totalItems: 0,
  totalAmount: 0,
  loading: false,
  error: null,

  // Coupon Engine state
  appliedCoupon: null,
  couponError: null,

  // Hardware Warranty state
  hasWarranty: false,
  warrantyCost: 2499,

  fetchCart: async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      // Guest mode
      try {
        const stored = JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
        let totalItems = 0;
        let totalAmount = 0;
        stored.forEach((item) => {
          totalItems += item.quantity;
          totalAmount += (item.effectivePrice || item.price) * item.quantity;
        });
        set({
          items: stored,
          totalItems,
          totalAmount,
          loading: false,
        });
      } catch {
        set({ items: [], totalItems: 0, totalAmount: 0, loading: false });
      }
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

  addToCart: async (productOrId, quantity = 1, productDetails = null) => {
    const token = sessionStorage.getItem('token');
    const productId = typeof productOrId === 'object' ? productOrId.id : productOrId;
    const productInfo = typeof productOrId === 'object' ? productOrId : productDetails;

    if (!token) {
      // Guest Cart logic
      const stored = JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
      const existingIdx = stored.findIndex((item) => item.productId === productId);

      let effectivePrice = productInfo?.discountPrice && productInfo.discountPrice > 0
        ? productInfo.discountPrice
        : (productInfo?.price || 0);

      let primaryImg = productInfo?.productImgs?.[0]?.imageUrl || '';

      if (existingIdx > -1) {
        stored[existingIdx].quantity += quantity;
        stored[existingIdx].subtotal = stored[existingIdx].quantity * stored[existingIdx].effectivePrice;
      } else {
        stored.push({
          id: 'guest_' + productId + '_' + Date.now(),
          productId: productId,
          name: productInfo?.name || 'Laptop',
          brand: productInfo?.brand || '',
          sku: productInfo?.sku || '',
          price: productInfo?.price || 0,
          discountPrice: productInfo?.discountPrice || null,
          effectivePrice: effectivePrice,
          quantity: quantity,
          stockQuantity: productInfo?.stockQuantity || 10,
          imageUrl: primaryImg,
          subtotal: effectivePrice * quantity,
        });
      }

      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(stored));

      let totalItems = 0;
      let totalAmount = 0;
      stored.forEach((item) => {
        totalItems += item.quantity;
        totalAmount += item.effectivePrice * item.quantity;
      });

      set({
        items: stored,
        totalItems,
        totalAmount,
        loading: false,
      });

      // Recalculate coupon if applied
      if (get().appliedCoupon) {
        get().applyCoupon(get().appliedCoupon.code);
      }

      return { success: true };
    }

    // Authenticated logic
    set({ loading: true, error: null });
    try {
      const res = await api.post('/cart/add', { productId, quantity });
      set({
        items: res.data.items || [],
        totalItems: res.data.totalItems || 0,
        totalAmount: res.data.totalAmount || 0,
        loading: false,
      });

      if (get().appliedCoupon) {
        get().applyCoupon(get().appliedCoupon.code);
      }

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
    const token = sessionStorage.getItem('token');

    if (!token || String(cartItemId).startsWith('guest_')) {
      // Guest cart update
      const stored = JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
      let updated;
      if (quantity <= 0) {
        updated = stored.filter(i => i.id !== cartItemId);
      } else {
        updated = stored.map(i => {
          if (i.id === cartItemId) {
            return {
              ...i,
              quantity,
              subtotal: quantity * i.effectivePrice
            };
          }
          return i;
        });
      }
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated));

      let totalItems = 0;
      let totalAmount = 0;
      updated.forEach((item) => {
        totalItems += item.quantity;
        totalAmount += item.effectivePrice * item.quantity;
      });

      set({ items: updated, totalItems, totalAmount });
      if (get().appliedCoupon) {
        get().applyCoupon(get().appliedCoupon.code);
      }
      return { success: true };
    }

    set({ loading: true, error: null });
    try {
      const res = await api.put(`/cart/items/${cartItemId}`, { quantity });
      set({
        items: res.data.items || [],
        totalItems: res.data.totalItems || 0,
        totalAmount: res.data.totalAmount || 0,
        loading: false,
      });
      if (get().appliedCoupon) {
        get().applyCoupon(get().appliedCoupon.code);
      }
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
    const token = sessionStorage.getItem('token');

    if (!token || String(cartItemId).startsWith('guest_')) {
      const stored = JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
      const updated = stored.filter(i => i.id !== cartItemId);
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated));

      let totalItems = 0;
      let totalAmount = 0;
      updated.forEach((item) => {
        totalItems += item.quantity;
        totalAmount += item.effectivePrice * item.quantity;
      });

      set({ items: updated, totalItems, totalAmount });
      if (get().appliedCoupon) {
        get().applyCoupon(get().appliedCoupon.code);
      }
      return { success: true };
    }

    set({ loading: true, error: null });
    try {
      const res = await api.delete(`/cart/items/${cartItemId}`);
      set({
        items: res.data.items || [],
        totalItems: res.data.totalItems || 0,
        totalAmount: res.data.totalAmount || 0,
        loading: false,
      });
      if (get().appliedCoupon) {
        get().applyCoupon(get().appliedCoupon.code);
      }
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
    const token = sessionStorage.getItem('token');
    localStorage.removeItem(GUEST_CART_KEY);

    if (token) {
      try {
        await api.delete('/cart/clear');
      } catch (err) {
        // Ignore
      }
    }
    set({ items: [], totalItems: 0, totalAmount: 0, appliedCoupon: null });
  },

  mergeGuestCart: async () => {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    try {
      const stored = JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
      if (stored && stored.length > 0) {
        const payload = stored.map(i => ({
          productId: i.productId,
          quantity: i.quantity
        }));
        await api.post('/cart/merge', payload);
        localStorage.removeItem(GUEST_CART_KEY);
      }
      get().fetchCart();
    } catch (err) {
      console.error('Cart merge error:', err);
      get().fetchCart();
    }
  },

  // Promo Code / Coupon Engine
  applyCoupon: async (code) => {
    if (!code || !code.trim()) {
      set({ couponError: 'Please enter a coupon code' });
      return { success: false, message: 'Please enter a coupon code' };
    }

    const { totalAmount } = get();
    try {
      const res = await api.post('/public/coupons/apply', {
        code: code.trim(),
        orderAmount: totalAmount
      });

      if (res.data?.valid) {
        set({
          appliedCoupon: res.data,
          couponError: null
        });
        return { success: true, data: res.data };
      } else {
        set({
          appliedCoupon: null,
          couponError: res.data?.message || 'Invalid coupon'
        });
        return { success: false, message: res.data?.message };
      }
    } catch (err) {
      const msg = typeof err.response?.data === 'string'
        ? err.response.data
        : 'Failed to apply coupon';
      set({ appliedCoupon: null, couponError: msg });
      return { success: false, message: msg };
    }
  },

  removeCoupon: () => {
    set({ appliedCoupon: null, couponError: null });
  },

  // Warranty Toggle
  toggleWarranty: (value) => {
    set({ hasWarranty: value !== undefined ? value : !get().hasWarranty });
  },

  reset: () => {
    set({ items: [], totalItems: 0, totalAmount: 0, error: null, appliedCoupon: null });
  }
}));
