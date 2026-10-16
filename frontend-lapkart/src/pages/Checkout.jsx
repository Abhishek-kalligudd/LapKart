import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, CreditCard, Banknote, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { api } from '../api/axios';
import Loader from '../components/Loader';

export default function Checkout() {
  const { items, totalItems, totalAmount, fetchCart, reset: resetCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

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
  }, [user, navigate, fetchCart]);

  if (!user) {
    return null;
  }

  if (items.length === 0 && !submitting) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <h2 className="text-2xl font-bold mb-3">No Items to Checkout</h2>
        <p className="text-muted-foreground mb-6">Your cart is currently empty. Please add items before proceeding.</p>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.streetAddress.trim() || !formData.city.trim() || !formData.state.trim() || !formData.pinCode.trim()) {
      setErrorMessage('Please fill in all shipping address fields.');
      return;
    }

    const formattedAddress = `${formData.fullName}, Phone: ${formData.phone}, ${formData.streetAddress}, ${formData.city}, ${formData.state} - ${formData.pinCode}`;

    setSubmitting(true);
    try {
      const response = await api.post('/orders', {
        shippingAddress: formattedAddress,
        contactPhone: formData.phone,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment',
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

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20 font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Shipping & Payment */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Shipping Address */}
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b">
              <Truck className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">1. Shipping Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  Full Recipient Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  Street Address & House / Flat No. *
                </label>
                <textarea
                  rows="2"
                  name="streetAddress"
                  required
                  value={formData.streetAddress}
                  onChange={handleChange}
                  placeholder="Flat 402, Sunset Heights, MG Road"
                  className="w-full px-3.5 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Bangalore"
                  className="w-full px-3.5 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Karnataka"
                  className="w-full px-3.5 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  PIN Code *
                </label>
                <input
                  type="text"
                  name="pinCode"
                  required
                  value={formData.pinCode}
                  onChange={handleChange}
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
              {/* Cash on Delivery Option */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
                    : 'border-border hover:bg-muted/40'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
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
              </label>

              {/* Online Payment via Razorpay Option (Deferred preview) */}
              <label
                className="flex items-start gap-4 p-4 rounded-xl border border-dashed border-border opacity-70 cursor-not-allowed bg-muted/20"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  disabled
                  checked={false}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-sm text-muted-foreground">Online Payment (Razorpay / Cards / UPI)</span>
                    <span className="text-[10px] bg-muted text-muted-foreground font-semibold px-2 py-0.5 rounded-full">
                      Integration Pending
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Instant checkout with UPI, NetBanking, and Credit Cards via Razorpay.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-card border rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-4 pb-3 border-b">Order Review</h2>

            {/* Items mini list */}
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
                  <span className="font-semibold text-xs whitespace-nowrap">₹{item.subtotal}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 text-sm pt-3 border-t">
              <div className="flex justify-between text-muted-foreground">
                <span>Items Subtotal ({totalItems})</span>
                <span className="font-medium text-foreground">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="font-medium text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Payment Mode</span>
                <span className="font-medium text-foreground">Cash on Delivery</span>
              </div>

              <div className="pt-3 border-t flex justify-between items-baseline">
                <span className="text-base font-bold text-foreground">Total Payable</span>
                <span className="text-2xl font-extrabold text-primary">₹{totalAmount}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-6 py-3.5 px-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:shadow-lg hover:bg-primary/90 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <span>Placing Your Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Confirm & Place Order</span>
                </>
              )}
            </button>

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
