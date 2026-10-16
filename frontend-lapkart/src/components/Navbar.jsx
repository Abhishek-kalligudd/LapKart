import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  LogOut,
  Laptop,
  Package,
  Menu,
  X,
  Shield,
  Heart,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { totalItems, fetchCart, reset: resetCart } = useCartStore();
  const { items: wishlistItems, fetchWishlist } = useWishlistStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = () => {
    logout();
    resetCart();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Shop Now', path: '/products', highlight: true },
    { name: 'About', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Leave Feedback', path: '/feedback' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-black/50 shadow-[0_8px_32px_rgba(0,0,0,0.8)] transition-all">
      <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo with Frosted Glass Badge */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg shadow-white/5 group-hover:border-cyan-400/50 group-hover:scale-105 transition-all">
            <Laptop className="h-5 w-5 text-white group-hover:text-cyan-400 transition-colors" />
          </div>
          <span className="font-black text-2xl tracking-tight text-white drop-shadow-[0_0_14px_rgba(255,255,255,0.55)] group-hover:drop-shadow-[0_0_22px_rgba(255,255,255,0.85)] transition-all">
            LapKart
          </span>
        </Link>

        {/* Center Horizontal Navigation Links (Glassmorphism Pill Dock) */}
        {!isAuthPage && (
          <div className="hidden md:flex items-center space-x-1 lg:space-x-1.5 bg-white/[0.04] p-1.5 rounded-full border border-white/10 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 lg:px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-black font-black shadow-lg shadow-white/20 scale-[1.02]'
                      : link.highlight
                      ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 hover:text-cyan-300'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.08] hover:border-white/10 border border-transparent'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}

        {/* Right Actions: Wishlist, Cart, User / Admin, Menu */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Wishlist Button */}
          {!isAuthPage && (
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md text-zinc-300 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all flex items-center justify-center shadow-sm"
              title="Saved Wishlist"
            >
              <Heart className="h-5 w-5 text-red-500" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-[11px] font-bold text-white rounded-full flex items-center justify-center shadow-md">
                  {wishlistItems.length > 99 ? '99+' : wishlistItems.length}
                </span>
              )}
            </Link>
          )}

          {/* Shopping Cart Button */}
          {!isAuthPage && (
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md text-zinc-300 hover:text-white hover:border-white/25 hover:bg-white/[0.08] transition-all flex items-center justify-center shadow-sm"
              title="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5 text-white" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-white text-[11px] font-black text-black rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          )}

          {/* User Account / Admin Controls */}
          {user ? (
            <div className="flex items-center space-x-2.5">
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 backdrop-blur-md transition-all shadow-sm"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}
              <div className="group relative">
                <button
                  type="button"
                  className="p-2.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md text-zinc-300 hover:text-white hover:border-white/25 hover:bg-white/[0.08] transition-all flex items-center justify-center shadow-sm"
                >
                  <User className="h-5 w-5" />
                </button>
                <div className="absolute right-0 w-56 mt-2 p-2 bg-black/85 border border-white/15 backdrop-blur-2xl rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-3.5 py-2.5 text-xs font-semibold border-b border-white/10 mb-1">
                    <span className="text-zinc-500 block text-[10px] font-mono uppercase tracking-wider">Signed in as</span>
                    <span className="text-white truncate block font-black text-sm">{user.username}</span>
                  </div>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="w-full flex items-center px-3 py-2 text-xs text-cyan-300 font-bold hover:bg-white/10 rounded-xl mb-1"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="w-full flex items-center px-3 py-2 text-xs text-zinc-200 hover:text-white hover:bg-white/10 rounded-xl mb-1"
                  >
                    <User className="h-4 w-4 mr-2 text-cyan-400" />
                    My Profile
                  </Link>
                  <Link
                    to="/wishlist"
                    className="w-full flex items-center px-3 py-2 text-xs text-zinc-200 hover:text-white hover:bg-white/10 rounded-xl mb-1"
                  >
                    <Heart className="h-4 w-4 mr-2 text-red-500" />
                    My Wishlist ({wishlistItems.length})
                  </Link>
                  <Link
                    to="/orders"
                    className="w-full flex items-center px-3 py-2 text-xs text-zinc-200 hover:text-white hover:bg-white/10 rounded-xl mb-1"
                  >
                    <Package className="h-4 w-4 mr-2 text-zinc-400" />
                    My Orders
                  </Link>
                  <Link
                    to="/cart"
                    className="w-full flex items-center px-3 py-2 text-xs text-zinc-200 hover:text-white hover:bg-white/10 rounded-xl mb-1"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2 text-zinc-400" />
                    Cart ({totalItems})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 text-xs text-red-400 hover:bg-red-500/15 rounded-xl transition-colors font-medium border-t border-white/10 mt-1 pt-2"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : isAuthPage ? (
            <Link
              to={location.pathname === '/login' ? '/register' : '/login'}
              className="text-xs font-black px-4 py-2 rounded-full bg-white text-black hover:bg-zinc-200 transition-all shadow-md shadow-white/10"
            >
              {location.pathname === '/login' ? 'Create Account' : 'Sign In'}
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-xs font-black px-4 py-2 rounded-full bg-white text-black hover:bg-zinc-200 transition-all shadow-md shadow-white/10"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Hamburger Toggle Button with Glassmorphism */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2.5 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown with Deep Glassmorphism */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-2xl px-4 py-5 space-y-2 shadow-2xl animate-fade-in">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold border transition-all ${
                  isActive
                    ? 'bg-white text-black border-white shadow-lg'
                    : link.highlight
                    ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20'
                    : 'bg-white/[0.03] text-zinc-300 border-white/10 hover:text-white hover:bg-white/[0.07]'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </Link>
            );
          })}

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </span>
              <ChevronRight className="w-4 h-4 text-cyan-500" />
            </Link>
          )}

          {!user && (
            <div className="pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center py-3 rounded-xl bg-white text-black font-black text-sm shadow-md"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
