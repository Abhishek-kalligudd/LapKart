import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Clock, MapPin, ArrowRight, ShoppingBag } from 'lucide-react';
import { api } from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { OrdersSkeleton } from '../components/Skeleton';

export default function Orders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const res = await api.get('/orders');
          setOrders(res.data);
        } catch (err) {
          // Handled or empty
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <Package className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Please Sign In</h2>
        <p className="text-muted-foreground mb-8">Sign in to view your order history and track deliveries.</p>
        <Link
          to="/login"
          className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return <OrdersSkeleton />;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200';
      case 'Processing':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-8 pb-4 border-b">
        <h1 className="text-3xl font-extrabold tracking-tight">My Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">Track status, shipments, and invoice details</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-card border rounded-2xl p-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5 text-primary">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No Orders Found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You haven't placed any orders yet. Discover our powerful laptops and place your first order today!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="bg-muted/30 p-4 sm:p-6 border-b flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">Order #</span>
                    <span className="font-mono font-bold text-base text-foreground">{order.orderNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'Recent'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusBadge(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground block">Total Amount</span>
                    <span className="font-extrabold text-lg text-primary">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 sm:p-6 divide-y">
                {order.items && order.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted/40 rounded-xl overflow-hidden flex-shrink-0 border p-1">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=200'}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-primary uppercase">{item.brand}</span>
                      <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity} × ₹{item.priceLocked}
                      </p>
                    </div>
                    <span className="font-bold text-sm">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="bg-muted/10 p-4 sm:px-6 border-t flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-start gap-1.5 max-w-lg truncate">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 text-primary flex-shrink-0" />
                  <span className="truncate">Delivering to: {order.shippingAddress}</span>
                </div>
                <div className="font-medium text-foreground">
                  Payment Status: <span className="font-semibold text-primary">{order.paymentStatus}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
