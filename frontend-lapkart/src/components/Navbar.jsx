import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Laptop } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Laptop className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight text-primary">LapKart</span>
        </Link>
        
        <div className="flex-1 max-w-xl px-4 hidden md:flex">
          <input 
            type="text" 
            placeholder="Search laptops..." 
            className="w-full h-10 px-4 rounded-full border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 hover:bg-accent rounded-full transition-colors">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-[10px] font-bold text-primary-foreground rounded-full flex items-center justify-center">
              0
            </span>
          </button>

          {user ? (
            <div className="flex items-center space-x-4">
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm font-medium hover:text-primary">Admin</Link>
              )}
              <div className="group relative">
                <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-accent transition-colors">
                  <User className="h-5 w-5" />
                </button>
                <div className="absolute right-0 w-48 mt-2 p-2 bg-popover border rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="px-2 py-1.5 text-sm font-medium border-b mb-1">{user.username}</div>
                  <button onClick={handleLogout} className="w-full flex items-center px-2 py-1.5 text-sm text-destructive hover:bg-accent rounded-sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
