import React, { useState, useEffect } from 'react';
import { Package, Users, Tags, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Laptop Models',
      value: stats.totalProducts,
      icon: Package,
      link: '/admin/products',
      linkText: 'View Products',
      description: 'Laptops in database inventory',
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40',
    },
    {
      label: 'Laptop Categories',
      value: stats.totalCategories,
      icon: Tags,
      link: '/admin/categories',
      linkText: 'Manage Categories',
      description: 'Product taxonomy & filters',
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40',
    },
    {
      label: 'Registered Accounts',
      value: stats.totalUsers,
      icon: Users,
      link: '/admin/users',
      linkText: 'View Users',
      description: 'Customer and admin accounts',
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time summary of your LapKart database catalog, categories, and registered users.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="p-6 bg-card rounded-2xl border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {card.label}
                  </span>
                  <div className={`p-2.5 rounded-xl ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-foreground">
                  {loading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    card.value
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t flex items-center justify-between">
                <Link
                  to={card.link}
                  className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
                >
                  <span>{card.linkText}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-card rounded-2xl border shadow-sm p-6">
        <h3 className="text-base font-bold text-foreground mb-4">Quick Admin Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/admin/products"
            className="p-4 rounded-xl border bg-background hover:bg-muted/40 transition-colors flex items-center space-x-3 group"
          >
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Add New Laptop</div>
              <div className="text-xs text-muted-foreground">Add specs, price, and photos</div>
            </div>
          </Link>

          <Link
            to="/admin/categories"
            className="p-4 rounded-xl border bg-background hover:bg-muted/40 transition-colors flex items-center space-x-3 group"
          >
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Tags className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Create Category</div>
              <div className="text-xs text-muted-foreground">New category and slug</div>
            </div>
          </Link>

          <Link
            to="/admin/users"
            className="p-4 rounded-xl border bg-background hover:bg-muted/40 transition-colors flex items-center space-x-3 group"
          >
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Inspect Users</div>
              <div className="text-xs text-muted-foreground">View all customer accounts</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
