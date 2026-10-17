import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Clock,
  MapPin,
  ArrowRight,
  ShoppingBag,
  XCircle,
  AlertTriangle,
  CheckCircle2,
  Truck,
  FileText,
  Printer,
  Download,
  X,
  ShieldCheck
} from 'lucide-react';
import { api } from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { OrdersSkeleton } from '../components/Skeleton';
import { formatCurrency } from '../lib/utils';

export default function Orders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [toast, setToast] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

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

  const handleCancelOrder = async (orderId) => {
    setCancellingId(orderId);
    setConfirmCancelId(null);
    try {
      const res = await api.post(`/orders/${orderId}/cancel`);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data : o)));
      showToast('success', 'Order cancelled and inventory automatically restocked.');
    } catch (err) {
      const msg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : 'Failed to cancel order. Please try again.';
      showToast('error', msg);
    } finally {
      setCancellingId(null);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <Package className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Please Sign In</h2>
        <p className="text-muted-foreground mb-8">Sign in to view your order history and track deliveries.</p>
        <Link to="/login" className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) return <OrdersSkeleton />;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200';
      case 'Shipped':   return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200';
      case 'Processing':return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200';
      default:          return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200';
    }
  };

  const canCancel = (status) => status === 'Pending' || status === 'Processing';

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-semibold border ${
              toast.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200'
                : 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200'
            }`}
          >
            {toast.type === 'success'
              ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 pb-4 border-b">
        <h1 className="text-3xl font-extrabold tracking-tight">My Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">Track fulfillment, live courier transit, and print tax invoices</p>
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
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md">
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
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      }) : 'Recent'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusBadge(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground block">Total Amount</span>
                    <span className="font-extrabold text-lg text-primary">{formatCurrency(order.totalAmount)}</span>
                  </div>

                  {/* Invoice Button */}
                  <button
                    onClick={() => setInvoiceOrder(order)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-semibold hover:bg-muted transition-colors text-foreground"
                    title="View & Print GST Tax Invoice"
                  >
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    <span>Invoice</span>
                  </button>

                  {/* Cancel Button */}
                  {canCancel(order.orderStatus) && (
                    confirmCancelId === order.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-medium">Sure?</span>
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingId === order.id}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          {cancellingId === order.id ? 'Cancelling...' : 'Yes, Cancel'}
                        </button>
                        <button
                          onClick={() => setConfirmCancelId(null)}
                          className="text-xs px-3 py-1.5 rounded-lg border font-bold hover:bg-muted transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmCancelId(order.id)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-red-300 text-red-600 font-semibold hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Cancel Order
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Courier Tracking Strip (If Assigned by Admin) */}
              {(order.courierName || order.trackingNumber) && (
                <div className="bg-primary/5 border-b px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary" />
                    <span className="font-bold text-foreground">
                      Courier: {order.courierName || 'Expedited Logistics'}
                    </span>
                    {order.trackingNumber && (
                      <span className="font-mono bg-background px-2 py-0.5 rounded border border-border text-foreground font-semibold">
                        AWB: {order.trackingNumber}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-200">
                    Live Dispatch Tracking Active
                  </span>
                </div>
              )}

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
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatCurrency(item.priceLocked)}</p>
                    </div>
                    <span className="font-bold text-sm">{formatCurrency(item.subtotal)}</span>
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
                  Payment: <span className={`font-semibold ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : order.paymentStatus === 'Failed' ? 'text-red-600' : 'text-primary'}`}>{order.paymentStatus}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Tax Invoice Modal */}
      {invoiceOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-card border rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">GST Tax Invoice</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-all shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setInvoiceOrder(null)}
                  className="p-1.5 hover:bg-muted rounded-xl text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Sheet */}
            <div className="p-6 bg-background rounded-2xl border space-y-6 text-xs text-foreground">
              {/* Company Header */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h2 className="text-2xl font-black text-primary tracking-tight">LapKart</h2>
                  <p className="font-semibold text-muted-foreground mt-0.5">LapKart Technologies India Pvt Ltd</p>
                  <p className="text-muted-foreground">Outer Ring Road, Bellandur, Bangalore, KA - 560103</p>
                  <p className="font-mono text-muted-foreground mt-1">GSTIN: <span className="font-bold text-foreground">29AAACL8192K1Z9</span></p>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-xs uppercase tracking-wider font-extrabold text-primary block">Tax Invoice</span>
                  <div className="font-mono font-bold text-sm">INV-{invoiceOrder.orderNumber}</div>
                  <div className="text-muted-foreground">Date: {new Date(invoiceOrder.createdAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                  <div className="text-muted-foreground font-medium">Place of Supply: Karnataka (29)</div>
                </div>
              </div>

              {/* Billed To / Ship To */}
              <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl">
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground block mb-1">
                    Billed & Shipped To:
                  </span>
                  <div className="font-bold text-sm">{invoiceOrder.customerName || user?.username}</div>
                  <div className="text-muted-foreground">{invoiceOrder.customerEmail || user?.email}</div>
                  <div className="text-muted-foreground mt-1">{invoiceOrder.shippingAddress}</div>
                </div>
                <div className="space-y-1 text-right">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground block mb-1">
                    Order Credentials:
                  </span>
                  <div>Order Reference: <span className="font-mono font-bold">{invoiceOrder.orderNumber}</span></div>
                  <div>Payment Status: <span className="font-bold text-emerald-600">{invoiceOrder.paymentStatus}</span></div>
                  {invoiceOrder.courierName && (
                    <div>Carrier: <span className="font-bold">{invoiceOrder.courierName}</span> ({invoiceOrder.trackingNumber || 'Standard'})</div>
                  )}
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-muted/50 text-[11px] font-bold text-muted-foreground uppercase border-b">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">HSN</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Rate</th>
                      <th className="p-3 text-right">GST (18%)</th>
                      <th className="p-3 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-xs">
                    {invoiceOrder.items?.map((item, idx) => {
                      const netPrice = (item.priceLocked / 1.18);
                      const gstPerItem = item.priceLocked - netPrice;
                      return (
                        <tr key={item.id}>
                          <td className="p-3 text-muted-foreground">{idx + 1}</td>
                          <td className="p-3">
                            <span className="font-bold block">{item.name}</span>
                            <span className="text-[10px] text-muted-foreground uppercase">{item.brand} • SKU: {item.sku || 'N/A'}</span>
                          </td>
                          <td className="p-3 font-mono text-muted-foreground">84713010</td>
                          <td className="p-3 text-center font-bold">{item.quantity}</td>
                          <td className="p-3 text-right font-mono">₹{netPrice.toFixed(2)}</td>
                          <td className="p-3 text-right font-mono">₹{(gstPerItem * item.quantity).toFixed(2)}</td>
                          <td className="p-3 text-right font-bold font-mono">{formatCurrency(item.subtotal)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Total Calculation Strip */}
              <div className="flex justify-end">
                <div className="w-72 space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxable Value:</span>
                    <span className="font-mono">₹{(invoiceOrder.totalAmount / 1.18).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Integrated GST (IGST 18%):</span>
                    <span className="font-mono">₹{(invoiceOrder.totalAmount - (invoiceOrder.totalAmount / 1.18)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping Charges:</span>
                    <span className="font-semibold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-black text-base text-primary">
                    <span>Grand Total:</span>
                    <span className="font-mono">{formatCurrency(invoiceOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Signatory & Legal Footnote */}
              <div className="pt-4 border-t flex justify-between items-end text-[11px] text-muted-foreground">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Digitally Verified Computer-Generated GST Invoice</span>
                  </div>
                  <p>All brand warranties valid across authorized OEM repair centers across India.</p>
                </div>
                <div className="text-right">
                  <div className="font-serif italic font-bold text-foreground text-sm">LapKart Authorised Signatory</div>
                  <span className="text-[10px] text-muted-foreground">Finance & Compliance Bureau</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
