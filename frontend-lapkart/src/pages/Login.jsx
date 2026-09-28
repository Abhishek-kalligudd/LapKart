import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Laptop, ArrowRight } from 'lucide-react';
import { api } from '../api/axios';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      // The backend should return the token in response and also set HttpOnly cookie
      setAuth(res.data.user, res.data.token);
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      alert('Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-card p-8 rounded-2xl shadow-xl border"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <Laptop className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-muted-foreground text-sm mt-1">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Password</label>
              <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full h-10 px-3 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full h-10 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 flex items-center justify-center space-x-2 transition-colors mt-6"
          >
            <span>Sign In</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
        </div>
      </motion.div>
    </div>
  );
}
