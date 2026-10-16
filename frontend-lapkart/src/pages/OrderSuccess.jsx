import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Home, Calendar, MapPin, CreditCard } from 'lucide-react';
import { api } from '../api/axios';
import Loader from '../components/Loader';

export default function OrderSuccess() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && orderNumber) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/number/${orderNumber}`);
          setOrder(res.data);
        } catch (err) {
          // If fail to fetch, still show orderNumber
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [orderNumber, order]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle className="w-12 h-12" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base mb-8">
          Thank you for choosing LapKart. We've received your order and our hardware specialists are prepping your laptop!
        </p>

        {/* Order Details Card */}
        <div className="bg-card border rounded-2xl p-6 text-left shadow-sm mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b gap-2">
            <div>
              <span className="text-xs text-muted-foreground block">Order Number</span>
              <span className="font-mono font-bold text-lg text-primary">{orderNumber}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Estimated Delivery</span>
              <span className="font-semibold text-sm">3 - 5 Business Days</span>
            </div>
          </div>

          {order && (
            <>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <div>
                    <span className="font-medium text-foreground block">Shipping To:</span>
                    <span>{order.shippingAddress}</span>
                  </div>
                </div>

                <div className="flex justify-between pt-2 border-t font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-lg font-bold text-primary">₹{order.totalAmount}</span>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="pt-3 border-t">
                  <span className="text-xs font-semibold text-muted-foreground uppercase block mb-2">
                    Items in Order ({order.items.length})
                  </span>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs">
                        <span className="font-medium truncate max-w-[280px]">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-semibold">₹{item.subtotal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md"
          >
            <Package className="w-4 h-4" />
            <span>Track in My Orders</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border font-semibold rounded-xl hover:bg-muted transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
