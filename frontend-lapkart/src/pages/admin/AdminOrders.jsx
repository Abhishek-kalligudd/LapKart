import React, { useEffect, useState } from 'react';
import { Package, Clock, Eye, CheckCircle2, AlertCircle, Search, Filter } from 'lucide-react';
import { api } from '../../api/axios';
import Loader from '../../components/Loader';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data);
    } catch (err) {
      // Ignore or log error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newOrderStatus, currentPaymentStatus) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/admin/orders/${orderId}/status`, {
        orderStatus: newOrderStatus,
        paymentStatus: currentPaymentStatus,
      });
      await fetchOrders();
    } catch (err) {
      alert('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentStatusChange = async (orderId, currentOrderStatus, newPaymentStatus) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/admin/orders/${orderId}/status`, {
        orderStatus: currentOrderStatus,
        paymentStatus: newPaymentStatus,
      });
      await fetchOrders();
    } catch (err) {
      alert('Failed to update payment status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'ALL' || order.orderStatus === statusFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customer Orders</h2>
          <p className="text-sm text-muted-foreground">Manage order fulfillments and update shipment statuses</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Order # or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-card w-64 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b text-xs uppercase text-muted-foreground font-semibold">
              <tr>
                <th className="px-6 py-4">Order #</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Order Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-muted-foreground">
                    No orders match your filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-primary">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{order.customerName || 'Customer'}</div>
                      <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        disabled={updatingId === order.id}
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value, order.paymentStatus)
                        }
                        className="text-xs font-semibold px-2.5 py-1 rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        disabled={updatingId === order.id}
                        value={order.paymentStatus}
                        onChange={(e) =>
                          handlePaymentStatusChange(order.id, order.orderStatus, e.target.value)
                        }
                        className="text-xs font-semibold px-2.5 py-1 rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 hover:bg-muted rounded-md text-primary font-medium inline-flex items-center gap-1 text-xs"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <h3 className="text-xl font-bold">Order Details</h3>
                <span className="font-mono text-xs text-primary">{selectedOrder.orderNumber}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-xl">
              <div>
                <span className="text-xs text-muted-foreground block">Customer:</span>
                <span className="font-semibold">{selectedOrder.customerName} ({selectedOrder.customerEmail})</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Shipping Address:</span>
                <span className="font-medium">{selectedOrder.shippingAddress}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">Ordered Laptops</h4>
              <div className="divide-y border rounded-xl overflow-hidden">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="p-3 flex items-center gap-3 text-sm">
                    <div className="w-12 h-12 bg-muted/40 rounded-lg overflow-hidden flex-shrink-0 border p-1">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=200'}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-primary uppercase">{item.brand}</span>
                      <h5 className="font-semibold text-xs">{item.name}</h5>
                      <span className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{item.priceLocked}</span>
                    </div>
                    <span className="font-bold">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t">
              <span className="font-bold text-base">Grand Total:</span>
              <span className="text-xl font-extrabold text-primary">₹{selectedOrder.totalAmount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
