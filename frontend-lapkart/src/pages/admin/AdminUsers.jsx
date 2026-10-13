import React, { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import { Users, Search, Shield, User as UserIcon, Mail, Phone, Calendar } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role?.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Registered Users</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of customer and administrator accounts in LapKart.
          </p>
        </div>
      </div>

      {/* Filters and Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="ALL">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="customer">Customers</option>
          </select>
        </div>
        <div className="text-sm text-muted-foreground flex items-center space-x-2">
          <Users className="h-4 w-4 text-primary" />
          <span>Total Accounts: <strong>{users.length}</strong></span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground animate-pulse">
            Loading user profiles...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No accounts found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 border-b text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((u) => {
                  const isAdmin = u.role?.toLowerCase() === 'admin';
                  return (
                    <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        #{u.id}
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        <div className="flex items-center space-x-2.5">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            isAdmin ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                          }`}>
                            {isAdmin ? <Shield className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                          </div>
                          <span>{u.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        <div className="flex items-center space-x-1.5">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground/60" />
                          <span>{u.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {u.phone ? (
                          <div className="flex items-center space-x-1.5">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground/60" />
                            <span>{u.phone}</span>
                          </div>
                        ) : (
                          <span className="italic text-muted-foreground/50">Not provided</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isAdmin 
                            ? 'bg-primary/15 text-primary border border-primary/30' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {u.role || 'customer'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                          <span>
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
