import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { CartSkeleton } from '../components/Skeleton';

export default function Cart() {
  const { items, totalItems, totalAmount, loading, error, fetchCart, updateQuantity, removeItem, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Please Sign In</h2>
        <p className="text-muted-foreground mb-8">
          Sign in to your LapKart account to view your saved cart items and proceed to checkout.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-6 py-2.5 border font-semibold rounded-lg hover:bg-muted transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  if (loading && items.length === 0) {
    return <CartSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-extrabold mb-3">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any laptops to your cart yet. Explore our top-tier machines and build your ultimate setup!
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all"
          >
            <span>Explore Laptops</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex items-center justify-between mb-8 pb-4 border-b">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalItems} {totalItems === 1 ? 'laptop' : 'laptops'} in your bag
          </p>
        </div>
        <button
          onClick={() => clearCart()}
          className="text-sm text-destructive hover:underline font-medium flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          Clear Cart
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-card border rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row gap-5 items-center justify-between"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-24 h-24 bg-muted/50 rounded-xl overflow-hidden flex-shrink-0 border flex items-center justify-center p-2">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400'}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {item.brand}
                  </span>
                  <h3 className="font-bold text-base sm:text-lg text-foreground line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-bold text-foreground">
                      ₹{item.effectivePrice}
                    </span>
                    {item.discountPrice && item.discountPrice < item.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{item.price}
                      </span>
                    )}
                  </div>
                  {item.stockQuantity <= 3 && item.stockQuantity > 0 && (
                    <span className="text-xs text-amber-600 font-medium">
                      Only {item.stockQuantity} left in stock!
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Stepper & Subtotal */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0">
                <div className="flex items-center border rounded-lg bg-background shadow-inner">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={loading}
                    className="p-2 hover:bg-muted rounded-l-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
                    title="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3.5 py-1 text-sm font-semibold min-w-[2.5rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={loading || item.quantity >= item.stockQuantity}
                    className="p-2 hover:bg-muted rounded-r-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40"
                    title="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right min-w-[6rem]">
                  <span className="text-xs text-muted-foreground block">Subtotal</span>
                  <span className="font-bold text-base sm:text-lg">₹{item.subtotal}</span>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  title="Remove from cart"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}

          {/* Value Props Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="flex items-center gap-3 p-4 rounded-xl border bg-card/50">
              <Truck className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase">Free Express Shipping</h4>
                <p className="text-xs text-muted-foreground">Deliveries in 2-4 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl border bg-card/50">
              <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase">100% Genuine Laptops</h4>
                <p className="text-xs text-muted-foreground">Official brand warranty</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl border bg-card/50">
              <RefreshCw className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase">7-Day Replacement</h4>
                <p className="text-xs text-muted-foreground">Hassle-free return policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-card border rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-4 pb-3 border-b">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Items Subtotal ({totalItems})</span>
                <span className="font-medium text-foreground">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping & Handling</span>
                <span className="font-medium text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Tax (GST)</span>
                <span className="font-medium text-foreground">Included</span>
              </div>

              <div className="pt-3 border-t flex justify-between items-baseline">
                <div>
                  <span className="text-base font-bold text-foreground block">Grand Total</span>
                  <span className="text-xs text-muted-foreground">All applicable taxes included</span>
                </div>
                <span className="text-2xl font-extrabold text-primary">₹{totalAmount}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-6 py-3.5 px-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:shadow-lg hover:bg-primary/90 flex items-center justify-center gap-2 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <Link
              to="/"
              className="w-full block text-center mt-3 text-sm text-muted-foreground hover:text-foreground font-medium py-2 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
