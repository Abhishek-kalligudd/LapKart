import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Laptop, ArrowRight, Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../api/axios';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const peekTimerRef = useRef(null);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    return () => {
      if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
    };
  }, []);

  // Show password for exactly 1 second, then automatically re-hide
  const handlePeekPassword = (e) => {
    e.preventDefault();
    if (peekTimerRef.current) clearTimeout(peekTimerRef.current);

    if (showPassword) {
      setShowPassword(false);
      return;
    }

    setShowPassword(true);
    peekTimerRef.current = setTimeout(() => {
      setShowPassword(false);
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      setAuth(res.data.user, res.data.token);
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        setError('Unable to connect to the backend server. Render may be waking up from cold sleep (takes ~45s), please wait a moment and try again.');
      } else {
        setError('Login failed. Please verify your email and password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-background relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.02] blur-[140px] rounded-full pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-card/85 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] border border-white/10 relative"
      >
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 backdrop-blur-md flex items-center justify-center text-white mb-4 shadow-lg shadow-white/5">
            <Laptop className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome back
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Sign in to manage orders, wishlist & checkout
          </p>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2.5 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-white/10 bg-white/[0.04] text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all text-sm font-sans"
                placeholder="name@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Input with 1-Second Peek Eye */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold">
                Password
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">
                {showPassword ? 'Revealed for 1s' : 'Tap eye to peek'}
              </span>
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-10 pr-12 rounded-xl border border-white/10 bg-white/[0.04] text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all text-sm font-sans tracking-wide"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={handlePeekPassword}
                title={showPassword ? 'Hide password' : 'Peek password for 1 second'}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-cyan-400 animate-pulse" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-white text-black hover:bg-zinc-200 rounded-xl font-black text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-white/10 mt-6 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-zinc-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-white font-bold hover:underline ml-1">
            Create an account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
