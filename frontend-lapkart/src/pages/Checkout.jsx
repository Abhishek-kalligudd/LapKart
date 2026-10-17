import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Truck, CreditCard, Banknote,
  ArrowLeft, Lock, Zap, CheckCircle2
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { api } from '../api/axios';
import Loader from '../components/Loader';
import { useRazorpay } from '../hooks/useRazorpay';
import { formatCurrency } from '../lib/utils';

export default function Checkout() {
  const {
    items,
    totalItems,
    totalAmount,
    fetchCart,
    reset: resetCart,
    appliedCoupon,
    hasWarranty,
    warrantyCost,
  } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const openRazorpay = useRazorpay();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: user?.username || '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    pinCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }
    fetchCart();

    api.get('/user/addresses')
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setSavedAddresses(res.data);
          const defaultAddr = res.data.find(a => a.isDefault) || res.data[0];
          setSelectedAddressId(defaultAddr.id);
          setFormData({
            fullName: defaultAddr.fullName,
            phone: defaultAddr.phone,
            streetAddress: defaultAddr.streetAddress,
            city: defaultAddr.city,
            state: defaultAddr.state,
            pinCode: defaultAddr.postalCode,
          });
        }
      })
      .catch(() => {});
  }, [user, navigate, fetchCart]);

  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setFormData({
      fullName: addr.fullName,
      phone: addr.phone,
      streetAddress: addr.streetAddress,
      city: addr.city,
      state: addr.state,
      pinCode: addr.postalCode,
    });
  };

  if (!user) return null;

  if (items.length === 0 && !submitting) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <h2 className="text-2xl font-bold mb-3">No Items to Checkout</h2>
        <p className="text-muted-foreground mb-6">Your cart is currently empty.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse Laptops
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { fullName, phone, streetAddress, city, state, pinCode } = formData;
    if (!fullName.trim() || !phone.trim() || !streetAddress.trim() || !city.trim() || !state.trim() || !pinCode.trim()) {
      setErrorMessage('Please fill in all shipping address fields.');
      return false;
    }
    return true;
  };

  // ── COD Flow ──────────────────────────────────────────────────────────────
  const handleCODSubmit = async () => {
    const formattedAddress = `${formData.fullName}, Phone: ${formData.phone}, ${formData.streetAddress}, ${formData.city}, ${formData.state} - ${formData.pinCode}`;
    setSubmitting(true);
    try {
      const response = await api.post('/orders', {
        shippingAddress: formattedAddress,
        contactPhone: formData.phone,
        paymentMethod: 'Cash on Delivery',
      });
      resetCart();
      navigate(`/order-success/${response.data.orderNumber}`, { state: { order: response.data } });
    } catch (err) {
      const errText = typeof err.response?.data === 'string'
        ? err.response.data
        : err.response?.data?.message || 'Failed to place order. Please try again.';
      setErrorMessage(errText);
      setSubmitting(false);
    }
  };

  // ── Razorpay Online Payment Flow ──────────────────────────────────────────
  const handleRazorpaySubmit = async () => {
    const formattedAddress = `${formData.fullName}, Phone: ${formData.phone}, ${formData.streetAddress}, ${formData.city}, ${formData.state} - ${formData.pinCode}`;
    setSubmitting(true);
    setErrorMessage('');

    let createdOrder = null;
    try {
      // Step 1: Create our internal order first (status = Processing, paymentStatus = Pending)
      const orderRes = await api.post('/orders', {
        shippingAddress: formattedAddress,
        contactPhone: formData.phone,
        paymentMethod: 'Online Payment',
      });
      createdOrder = orderRes.data;

      // Step 2: Create a Razorpay order on the backend (calls Razorpay API)
      const rzpOrderRes = await api.post('/payments/create-order', {
        lapkartOrderId: createdOrder.id,
      });
      const { razorpayOrderId, amount, currency, keyId } = rzpOrderRes.data;

      // Step 3: Open Razorpay popup
      openRazorpay({
        options: {
          key: keyId,
          amount,
          currency,
          name: 'LapKart',
          description: `Order #${createdOrder.orderNumber}`,
          order_id: razorpayOrderId,
          prefill: {
            name: formData.fullName,
            contact: formData.phone,
            email: user.email || '',
          },
          theme: { color: '#6366f1' },
        },

        // Step 4a: Payment SUCCESS → verify on backend → redirect
        onSuccess: async (razorpayResponse) => {
          try {
            await api.post('/payments/verify', {
              razorpayOrderId: razorpayResponse.razorpay_order_id,
              razorpayPaymentId: razorpayResponse.razorpay_payment_id,
              razorpaySignature: razorpayResponse.razorpay_signature,
              lapkartOrderId: createdOrder.id,
            });
            resetCart();
            navigate(`/order-success/${createdOrder.orderNumber}`, {
              state: { order: { ...createdOrder, paymentStatus: 'Paid' } },
            });
          } catch (verifyErr) {
            setErrorMessage('Payment received but verification failed. Contact support with Order #' + createdOrder.orderNumber);
            setSubmitting(false);
          }
        },

        // Step 4b: Payment FAILED or CANCELLED
        onFailure: (reason) => {
          setErrorMessage(
            typeof reason === 'string'
              ? reason
              : 'Payment was cancelled or failed. Your order has been saved — you can retry from My Orders.'
          );
          setSubmitting(false);
        },
      });
    } catch (err) {
      const errText = typeof err.response?.data === 'string'
        ? err.response.data
        : err.response?.data?.message || 'Failed to initiate payment. Please try again.';
      setErrorMessage(errText);
      setSubmitting(false);
    }
  };

  // ── Main Form Submit ───────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!validateForm()) return;
    if (paymentMethod === 'razorpay') {
      handleRazorpaySubmit();
    } else {
      handleCODSubmit();
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/cart" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Checkout</h1>
          <p className="text-sm text-muted-foreground">Complete your order with secure delivery</p>
        </div>
      </div>

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20 font-medium"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Left Side: Shipping & Payment ── */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Shipping Address */}
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b">
              <Truck className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">1. Shipping Address</h2>
            </div>

            {savedAddresses.length > 0 && (
              <div className="mb-6 space-y-2 pb-5 border-b">
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Select Saved Address:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr)}
                      className={`p-3.5 rounded-xl border cursor-pointer text-xs transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm'
                          : 'hover:bg-muted/40'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1 font-bold">
                        <span>{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground line-clamp-2">
                        {addr.streetAddress}, {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                      <span className="text-muted-foreground block mt-1 font-medium">
                        Ph: {addr.phone}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">Full Recipient Name *</label>
                <input
                  type="text" name="fullName" required
                  value={formData.fullName} onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">Contact Phone Number *</label>
                <input
                  type="tel" name="phone" required
                  value={formData.phone} onChange={handleChange}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">Street Address & House / Flat No. *</label>
                <textarea
                  rows="2" name="streetAddress" required
                  value={formData.streetAddress} onChange={handleChange}
                  placeholder="Flat 402, Sunset Heights, MG Road"
                  className="w-full px-3.5 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">City *</label>
                <input
                  type="text" name="city" required
                  value={formData.city} onChange={handleChange}
                  placeholder="Bangalore"
                  className="w-full px-3.5 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">State *</label>
                <input
                  type="text" name="state" required
                  value={formData.state} onChange={handleChange}
                  placeholder="Karnataka"
                  className="w-full px-3.5 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">PIN Code *</label>
                <input
                  type="text" name="pinCode" required
                  value={formData.pinCode} onChange={handleChange}
                  placeholder="560001"
                  className="w-full px-3.5 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">2. Payment Method</h2>
            </div>

            <div className="space-y-3">
              {/* Razorpay Online Payment */}
              <motion.label
                whileHover={{ scale: 1.01 }}
                onClick={() => setPaymentMethod('razorpay')}
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
                    : 'border-border hover:bg-muted/40'
                }`}
              >
                <input
                  type="radio" name="paymentMethod" value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                  className="mt-1 text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Zap className="w-5 h-5 text-indigo-500" />
                    <span className="font-bold text-sm">Pay Online — UPI / Cards / NetBanking</span>
                    <span className="text-[11px] bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded-full">
                      Razorpay
                    </span>
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Instant checkout with UPI (GPay, PhonePe), NetBanking, and Credit / Debit Cards.
                    Secured by Razorpay.
                  </p>
                  {paymentMethod === 'razorpay' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      A secure Razorpay payment popup will open after you click Pay.
                    </motion.div>
                  )}
                </div>
              </motion.label>

              {/* Cash on Delivery */}
              <motion.label
                whileHover={{ scale: 1.01 }}
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
                    : 'border-border hover:bg-muted/40'
                }`}
              >
                <input
                  type="radio" name="paymentMethod" value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-sm">Cash on Delivery / Pay on Delivery</span>
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
                      Available
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pay securely using Cash, UPI, or Card upon delivery of your laptop.
                  </p>
                </div>
              </motion.label>
            </div>
          </div>
        </div>

        {/* ── Right Side: Order Summary ── */}
        <div className="lg:col-span-5">
          <div className="bg-card border rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-4 pb-3 border-b">Order Review</h2>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-sm py-1">
                  <div className="w-12 h-12 bg-muted/40 rounded-lg overflow-hidden flex-shrink-0 border p-1">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=200'}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-xs truncate">{item.name}</h4>
                    <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-semibold text-xs whitespace-nowrap">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            {(() => {
              const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
              const warrantyTotal = hasWarranty ? warrantyCost : 0;
              const finalPayable = Math.max(0, totalAmount - discountAmount + warrantyTotal);

              return (
                <>
                  <div className="space-y-2.5 text-sm pt-3 border-t">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Items Subtotal ({totalItems})</span>
                      <span className="font-medium text-foreground">{formatCurrency(totalAmount)}</span>
                    </div>

                    {hasWarranty && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>+2 Year LapCare Protection</span>
                        <span>+{formatCurrency(warrantyCost)}</span>
                      </div>
                    )}

                    {appliedCoupon && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Coupon ({appliedCoupon.code})</span>
                        <span>-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span className="font-medium text-emerald-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Payment Mode</span>
                      <span className="font-medium text-foreground">
                        {paymentMethod === 'razorpay' ? 'Online (Razorpay)' : 'Cash on Delivery'}
                      </span>
                    </div>

                    <div className="pt-3 border-t flex justify-between items-baseline">
                      <span className="text-base font-bold text-foreground">Total Payable</span>
                      <span className="text-2xl font-extrabold text-primary">{formatCurrency(finalPayable)}</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-6 py-3.5 px-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:shadow-lg hover:bg-primary/90 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Processing...</span>
                    ) : paymentMethod === 'razorpay' ? (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Pay {formatCurrency(finalPayable)} via Razorpay</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Confirm & Place Order ({formatCurrency(finalPayable)})</span>
                      </>
                    )}
                  </motion.button>
                </>
              );
            })()}

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe & Secure 256-Bit Encrypted Order</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
