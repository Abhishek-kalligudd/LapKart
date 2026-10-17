import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { CartSkeleton } from '../components/Skeleton';
import { api } from '../api/axios';
import { formatCurrency } from '../lib/utils';

export default function Cart() {
  const {
    items,
    totalItems,
    totalAmount,
    loading,
    error,
    fetchCart,
    updateQuantity,
    removeItem,
    clearCart,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    hasWarranty,
    warrantyCost,
    toggleWarranty,
  } = useCartStore();

  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  useEffect(() => {
    fetchCart();
    // Fetch active coupons
    api.get('/public/coupons')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setAvailableCoupons(res.data);
        }
      })
      .catch(() => {});
  }, [fetchCart]);

  const handleApplyCoupon = async (codeToApply) => {
    const code = codeToApply || couponInput;
    if (!code.trim()) return;
    setApplyingCoupon(true);
    await applyCoupon(code);
    setApplyingCoupon(false);
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

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
            to="/products"
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all"
          >
            <span>Explore Laptops</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  // Calculations
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const warrantyTotal = hasWarranty ? warrantyCost : 0;
  const finalPayable = Math.max(0, totalAmount - discountAmount + warrantyTotal);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex items-center justify-between mb-8 pb-4 border-b">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalItems} {totalItems === 1 ? 'laptop' : 'laptops'} in your bag
            {!user && ' (Guest Cart)'}
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
        <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stock warning banner if any item is low stock */}
      {items.some(i => i.stockQuantity != null && i.stockQuantity <= 5 && i.stockQuantity > 0) && (
        <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span>High Demand Notice: One or more machines in your cart have limited stock. Checkout soon to guarantee inventory lock.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const isLowStock = item.stockQuantity != null && item.stockQuantity <= 5 && item.stockQuantity > 0;
            return (
              <motion.div
                key={item.id}
                layout
                className="bg-card border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 shadow-sm hover:shadow-md transition-shadow relative"
              >
                {/* Product Thumbnail */}
                <div className="w-24 h-24 bg-muted/40 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2 border">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=200'}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider">
                      {item.brand}
                    </span>
                    {isLowStock && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400 px-2 py-0.5 rounded-md">
                        Only {item.stockQuantity} Left!
                      </span>
                    )}
                  </div>

                  <Link to={`/product/${item.productId}`} className="hover:text-primary transition-colors">
                    <h3 className="font-bold text-base truncate">{item.name}</h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku || 'LPK-RIG'}</p>

                  <div className="mt-2 flex items-center justify-center sm:justify-start gap-2">
                    <span className="font-extrabold text-base text-foreground">
                      {formatCurrency(item.effectivePrice || item.price)}
                    </span>
                    {item.discountPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatCurrency(item.price)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-xl bg-background overflow-hidden shadow-inner">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-muted text-muted-foreground transition-colors"
                      title="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-sm font-bold min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-muted text-muted-foreground transition-colors"
                      title="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[5.5rem] hidden sm:block">
                  <span className="text-xs text-muted-foreground block">Item Total</span>
                  <span className="font-extrabold text-base text-foreground">
                    {formatCurrency(item.subtotal || ((item.effectivePrice || item.price) * item.quantity))}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Hardware Warranty Add-on Card */}
          <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="warranty-checkbox"
                checked={hasWarranty}
                onChange={(e) => toggleWarranty(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="warranty-checkbox" className="flex-1 cursor-pointer">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Add +2 Year LapCare Comprehensive Warranty
                  </span>
                  <span className="font-extrabold text-sm text-primary">+{formatCurrency(warrantyCost)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Includes 100% coverage for accidental drops, liquid spills, battery replacements, and doorstep engineer pickups.
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary & Coupon Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon / Promo Code Engine */}
          <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Tag className="w-4 h-4 text-primary" />
              <span>Promo Code / Coupons</span>
            </div>

            {appliedCoupon ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-bold text-xs uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{appliedCoupon.code} Applied</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
                    Saved {formatCurrency(appliedCoupon.discountAmount)} ({appliedCoupon.discountPercent}%)
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-md text-emerald-700 dark:text-emerald-300"
                  title="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. LAPKART10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3.5 py-2 text-xs font-mono font-bold uppercase rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={() => handleApplyCoupon()}
                    disabled={applyingCoupon || !couponInput.trim()}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    {applyingCoupon ? 'Checking...' : 'Apply'}
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-destructive font-medium">{couponError}</p>
                )}
              </div>
            )}

            {/* Clickable available coupon tags */}
            {availableCoupons.length > 0 && !appliedCoupon && (
              <div className="pt-2 border-t">
                <span className="text-[11px] font-semibold text-muted-foreground block mb-2">
                  Available Offers:
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableCoupons.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => handleApplyCoupon(c.code)}
                      className="px-2.5 py-1 rounded-lg border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-mono font-bold transition-all text-left"
                      title={c.description}
                    >
                      {c.code} ({c.discountPercent}%)
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Grand Summary Box */}
          <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold pb-3 border-b">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                <span className="font-semibold">{formatCurrency(totalAmount)}</span>
              </div>

              {hasWarranty && (
                <div className="flex justify-between text-emerald-600">
                  <span>+2 Year LapCare Protection</span>
                  <span className="font-semibold">+{formatCurrency(warrantyCost)}</span>
                </div>
              )}

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-{formatCurrency(appliedCoupon.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated GST (18%)</span>
                <span className="text-muted-foreground italic font-medium">Included in MRP</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Express Delivery</span>
                <span className="text-emerald-600 font-semibold">FREE</span>
              </div>

              <div className="pt-3 border-t flex justify-between items-baseline">
                <div>
                  <span className="font-extrabold text-base">Total Payable</span>
                  <span className="text-[11px] text-muted-foreground block">Inclusive of all taxes</span>
                </div>
                <span className="text-2xl font-black text-primary">{formatCurrency(finalPayable)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>{user ? 'Proceed to Checkout' : 'Sign In & Checkout'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!user && (
              <p className="text-[11px] text-center text-muted-foreground">
                Your guest cart will automatically sync upon sign-in.
              </p>
            )}

            <div className="pt-4 border-t space-y-2 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Bank-grade 256-bit encrypted checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" />
                <span>Direct dispatch from Bangalore tech hub</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
