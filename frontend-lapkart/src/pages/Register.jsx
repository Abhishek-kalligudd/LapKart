import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Laptop } from 'lucide-react';
import { api } from '../api/axios';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      alert('Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-card p-8 rounded-2xl shadow-xl border"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <Laptop className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Create an account</h2>
          <p className="text-muted-foreground text-sm mt-1">Start your journey with LapKart</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input 
              type="text" 
              required
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
              className="w-full h-10 px-3 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="johndoe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full h-10 px-3 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full h-10 px-3 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full h-10 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors mt-6"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}
