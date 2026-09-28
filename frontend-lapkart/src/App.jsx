import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import { useAuthStore } from './store/authStore';

import AdminProducts from './pages/admin/AdminProducts';

// Protected Route Component for Admin
const AdminRoute = ({ children }) => {
  const { user } = useAuthStore();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Layout for public pages
const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <footer className="border-t py-8 mt-auto bg-muted/20">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} LapKart. All rights reserved.
      </div>
    </footer>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          {/* Add more admin routes here later */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
