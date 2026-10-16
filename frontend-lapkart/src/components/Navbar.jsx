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
  Sparkles,
  Search,
  MessageSquare,
  Shield,
  Phone
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { totalItems, fetchCart, reset: resetCart } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <nav className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 transition-all">
      <div className="container mx-auto px-4 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
            <Laptop className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-foreground flex items-center gap-1">
              LapKart
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            </span>
            <span className="text-[10px] tracking-widest uppercase text-muted-foreground font-semibold -mt-1">
              Next-Gen Tech
            </span>
          </div>
        </Link>

        {/* Center Horizontal Navigation Links */}
        {!isAuthPage && (
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-muted/30 p-1.5 rounded-full border border-border/60">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : link.highlight
                      ? 'text-primary hover:bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  {link.highlight && (
                    <Sparkles className="inline-block w-3 h-3 mr-1.5 text-cyan-500" />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}

        {/* Right Actions: Cart, User / Admin, Menu */}
        <div className="flex items-center space-x-3">
          {/* Shopping Cart Button */}
          {!isAuthPage && (
            <Link
              to="/cart"
              className="relative p-2.5 hover:bg-accent rounded-full transition-colors flex items-center justify-center text-foreground border border-transparent hover:border-border"
              title="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-[11px] font-bold text-primary-foreground rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          )}

          {/* User Account / Admin Controls */}
          {user ? (
            <div className="flex items-center space-x-3">
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}
              <div className="group relative">
                <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-accent transition-colors border border-transparent hover:border-border">
                  <User className="h-5 w-5" />
                </button>
                <div className="absolute right-0 w-52 mt-2 p-2 bg-popover border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-3 py-2 text-xs font-semibold border-b mb-1">
                    <span className="text-muted-foreground block text-[10px]">Signed in as</span>
                    <span className="text-foreground truncate block font-bold">{user.username}</span>
                  </div>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="w-full flex items-center px-3 py-2 text-xs text-primary font-bold hover:bg-accent rounded-lg mb-1"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/orders"
                    className="w-full flex items-center px-3 py-2 text-xs text-foreground hover:bg-accent rounded-lg mb-1"
                  >
                    <Package className="h-4 w-4 mr-2 text-primary" />
                    My Orders
                  </Link>
                  <Link
                    to="/cart"
                    className="w-full flex items-center px-3 py-2 text-xs text-foreground hover:bg-accent rounded-lg mb-1"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2 text-primary" />
                    Cart ({totalItems})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-lg transition-colors font-medium"
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
              className="text-xs font-bold px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
            >
              {location.pathname === '/login' ? 'Create Account' : 'Sign In'}
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-xs font-bold px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-lg px-4 py-4 space-y-2 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block px-4 py-2.5 rounded-xl text-sm font-bold ${
                location.pathname === link.path
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="block px-4 py-2.5 rounded-xl text-sm font-bold text-primary bg-primary/10"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
