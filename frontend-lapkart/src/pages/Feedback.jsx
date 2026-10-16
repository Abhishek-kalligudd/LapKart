import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Construction, Sparkles, ArrowLeft, Bell, Check, Laptop } from 'lucide-react';

export default function Feedback() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNotify = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-20 px-4 bg-background">
      <div className="max-w-xl w-full text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Animated Construction Icon */}
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-primary/10 animate-ping opacity-25" />
            <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg">
              <Construction className="w-12 h-12" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Under Active Construction
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              Feedback Hub is in Progress
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
              We are currently engineering our verified customer review, bench-marking feedback, and telemetry rating system. This page will be live in our next release!
            </p>
          </div>

          {/* Construction Progress Bar */}
          <div className="bg-card border rounded-2xl p-6 shadow-sm max-w-md mx-auto text-left space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-foreground">Module Build Status</span>
              <span className="text-primary font-mono">82% Completed</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 h-full rounded-full transition-all duration-1000 animate-pulse"
                style={{ width: '82%' }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground block text-center pt-1">
              Estimated deployment: LapKart Platform Update v2.4
            </span>
          </div>

          {/* Email Notify Form */}
          <div className="max-w-md mx-auto pt-2">
            {subscribed ? (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 border border-emerald-200">
                <Check className="w-4 h-4" />
                <span>You're on the list! We will notify you when feedback opens.</span>
              </div>
            ) : (
              <form onSubmit={handleNotify} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter email to get notified on launch..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Bell className="w-3.5 h-3.5" />
                  Notify Me
                </button>
              </form>
            )}
          </div>

          {/* Navigation Action */}
          <div className="pt-4 flex justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border text-xs font-bold hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Home
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow hover:bg-primary/90 transition-colors"
            >
              <Laptop className="w-4 h-4" />
              Browse Laptops
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
