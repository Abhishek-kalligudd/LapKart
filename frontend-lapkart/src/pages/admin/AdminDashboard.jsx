import React from 'react';
import { Package, Users, DollarSign, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Revenue', value: '$45,231.89', icon: DollarSign, trend: '+20.1% from last month' },
    { label: 'Active Users', value: '+2350', icon: Users, trend: '+180.1% from last month' },
    { label: 'Products', value: '1,234', icon: Package, trend: '+19% from last month' },
    { label: 'Active Now', value: '+573', icon: Activity, trend: '+201 since last hour' },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label} 
              className="p-6 bg-card rounded-xl border shadow-sm"
            >
              <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{stat.label}</h3>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
