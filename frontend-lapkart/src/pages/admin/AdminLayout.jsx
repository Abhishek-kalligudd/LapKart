import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Tags, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function AdminLayout() {
  const location = useLocation();
  const { logout } = useAuthStore();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/categories', label: 'Categories', icon: Tags },
    { path: '/admin/users', label: 'Users', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="text-lg font-bold text-primary">LapKart Admin</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground font-medium' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <button 
            onClick={logout}
            className="flex items-center space-x-3 px-3 py-2 w-full text-left text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center px-8 border-b bg-card">
          <h1 className="text-xl font-semibold">Admin Panel</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
