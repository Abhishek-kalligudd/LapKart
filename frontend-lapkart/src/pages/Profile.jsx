import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Package,
  Heart,
  Shield,
  KeyRound,
  LogOut,
  Save,
  Clock
} from 'lucide-react';
import { api } from '../api/axios';
import { useAuthStore } from '../store/authStore';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Profile Edit State
  const [editData, setEditData] = useState({ username: '', phone: '' });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password State
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Address State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    isDefault: false,
  });
  const [addingAddress, setAddingAddress] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/profile');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/profile');
      setProfile(res.data);
      setEditData({
        username: res.data.username || '',
        phone: res.data.phone || '',
      });
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const res = await api.put('/user/profile', editData);
      setProfile(res.data);
      showToast('success', 'Profile information updated successfully!');
    } catch (err) {
      const msg = typeof err.response?.data === 'string' ? err.response.data : 'Failed to update profile';
      showToast('error', msg);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('error', 'New passwords do not match');
      return;
    }
    setUpdatingPassword(true);
    try {
      await api.put('/user/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('success', 'Password updated successfully!');
    } catch (err) {
      const msg = typeof err.response?.data === 'string' ? err.response.data : 'Failed to update password';
      showToast('error', msg);
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setAddingAddress(true);
    try {
      const res = await api.post('/user/addresses', newAddress);
      setProfile((prev) => ({
        ...prev,
        addresses: [res.data, ...(prev?.addresses || [])],
      }));
      setShowAddressForm(false);
      setNewAddress({
        fullName: '',
        phone: '',
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        isDefault: false,
      });
      showToast('success', 'Delivery address saved to your address book!');
    } catch (err) {
      const msg = typeof err.response?.data === 'string' ? err.response.data : 'Failed to save address';
      showToast('error', msg);
    } finally {
      setAddingAddress(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await api.delete(`/user/addresses/${id}`);
      setProfile((prev) => ({
        ...prev,
        addresses: prev.addresses.filter((a) => a.id !== id),
      }));
      showToast('success', 'Address removed');
    } catch {
      showToast('error', 'Failed to remove address');
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-semibold border ${
              toast.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200'
                : 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-card border rounded-3xl p-6 sm:p-8 mb-8 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-2xl">
            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">{profile?.username || user.username}</h1>
              <span className="text-[11px] font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full uppercase">
                {profile?.role || user.role || 'Customer'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{profile?.email || user.email}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/orders"
            className="px-4 py-2 rounded-xl border text-xs font-bold hover:bg-muted transition-colors flex items-center gap-1.5"
          >
            <Package className="w-4 h-4 text-primary" />
            <span>My Orders</span>
          </Link>
          <Link
            to="/wishlist"
            className="px-4 py-2 rounded-xl border text-xs font-bold hover:bg-muted transition-colors flex items-center gap-1.5"
          >
            <Heart className="w-4 h-4 text-red-500" />
            <span>Wishlist</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Profile Info & Password */}
        <div className="lg:col-span-5 space-y-8">
          {/* Personal Information */}
          <div className="bg-card border rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span>Personal Information</span>
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  Display Username *
                </label>
                <input
                  type="text"
                  required
                  value={editData.username}
                  onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  Registered Email Address (Locked)
                </label>
                <input
                  type="email"
                  disabled
                  value={profile?.email || user.email}
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-muted/40 text-muted-foreground text-xs cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 9876543210"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={updatingProfile}
                className="w-full py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{updatingProfile ? 'Saving Changes...' : 'Save Profile Details'}</span>
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-card border rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-primary" />
              <span>Security & Password</span>
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Repeat new password"
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={updatingPassword}
                className="w-full py-2.5 bg-secondary text-secondary-foreground text-xs font-bold rounded-xl hover:bg-secondary/80 transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{updatingPassword ? 'Updating Password...' : 'Change Password'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Address Book */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Saved Delivery Addresses</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage shipping destinations for rapid 1-click checkout.
                </p>
              </div>

              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddressForm ? 'Close' : 'Add New Address'}</span>
              </button>
            </div>

            {/* New Address Form */}
            {showAddressForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddAddress}
                className="p-5 rounded-2xl border bg-muted/20 space-y-4"
              >
                <h4 className="font-bold text-sm">Add New Delivery Location</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1 text-muted-foreground">Recipient Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-background"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-muted-foreground">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 9876543210"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-background"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold mb-1 text-muted-foreground">Street Address / Flat *</label>
                    <textarea
                      rows="2"
                      required
                      placeholder="e.g. 402, Lotus Towers, Whitefield"
                      value={newAddress.streetAddress}
                      onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-background"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-muted-foreground">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="Bangalore"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-background"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-muted-foreground">State *</label>
                    <input
                      type="text"
                      required
                      placeholder="Karnataka"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-background"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-muted-foreground">Postal PIN Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="560066"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-background"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                      className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="isDefault" className="text-xs font-semibold cursor-pointer">
                      Set as Default Shipping Address
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={addingAddress}
                  className="px-6 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-primary/90 transition-all shadow-sm"
                >
                  {addingAddress ? 'Saving...' : 'Save Address'}
                </button>
              </motion.form>
            )}

            {/* Address Cards List */}
            {profile?.addresses && profile.addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 rounded-2xl border bg-card shadow-sm space-y-3 relative group hover:border-primary/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="font-bold text-sm block">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="inline-block text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Default Address
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {addr.streetAddress}, {addr.city}, {addr.state} - {addr.postalCode}
                    </p>

                    <div className="text-[11px] text-muted-foreground font-medium pt-1 border-t flex items-center gap-1">
                      <Phone className="w-3 h-3 text-primary" />
                      <span>{addr.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed rounded-2xl p-6 text-muted-foreground space-y-2">
                <MapPin className="w-8 h-8 mx-auto text-muted-foreground/40" />
                <h4 className="font-bold text-sm text-foreground">No Saved Addresses Yet</h4>
                <p className="text-xs max-w-sm mx-auto">
                  Add your home or office address to enable rapid 1-click checkout on your next flagship order.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
