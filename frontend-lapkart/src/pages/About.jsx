import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Cpu,
  Zap,
  Award,
  Sparkles,
  CheckCircle2,
  Users,
  Compass,
  Headphones,
  Laptop
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Zero-Bullshit Authenticity',
      description:
        'Every single machine sold through LapKart is sourced directly from tier-1 authorized brand channels. Genuine manufacturer warranty, zero grey-market imports, zero refurbished masking.',
    },
    {
      icon: Cpu,
      title: '40-Point Lab Validation',
      description:
        'Before shipping, our certified technicians verify thermal dissipation under maximum synthetic load, run 3DMark stress tests, inspect for dead pixels, and ensure memory timings are rock-solid.',
    },
    {
      icon: Zap,
      title: 'Pure Bloatware-Free Setup',
      description:
        'We hate pre-installed junk as much as you do. Our machines arrive with pristine operating systems, the newest firmware patches, and optimal graphics drivers right out of the box.',
    },
    {
      icon: Award,
      title: 'Direct Brand Warranty Support',
      description:
        'Our partnerships with Apple, Acer, ASUS, Dell, HP, Samsung, and Gigabyte mean you get official on-site brand support and hassle-free warranty registration on day one.',
    },
  ];

  const stats = [
    { value: '25,000+', label: 'Laptops Delivered Across India' },
    { value: '99.8%', label: 'Zero-Defect Delivery Rate' },
    { value: '40-Point', label: 'Hardware Stress Test Checklist' },
    { value: '< 24h', label: 'Average Warehouse Dispatch Time' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              {/* <Sparkles className="w-3.5 h-3.5" /> */}
              The LapKart Manifesto
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-tight">
              We Don't Just Sell Laptops.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600">
                We Engineer Hardware Standards.
              </span>
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground mt-6 max-w-3xl mx-auto leading-relaxed">
              Founded by passionate engineers and hardware enthusiasts, LapKart was built on a simple premise: finding the exact laptop you need shouldn't involve marketing smoke and mirrors, inflated specs, or questionable grey-market imports.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Numbers Section */}
      <section className="py-16 border-b bg-muted/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-2">
                <span className="text-3xl sm:text-5xl font-black text-foreground tracking-tight block">
                  {s.value}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground font-medium block">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Engineering Pillars */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Our Core Standards
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-3">
              How LapKart sets itself apart from conventional mega-marketplaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="bg-card border rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow flex gap-5 items-start"
                >
                  <div className="p-3.5 rounded-2xl bg-primary/10 text-primary flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{p.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lab Verification Story */}
      <section className="py-20 bg-muted/30 border-y">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-card border rounded-3xl p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center gap-10">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
              <Laptop className="w-12 h-12 sm:w-16 sm:h-16" />
            </div>
            <div className="space-y-4">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                Bangalore Hardware Testing Center
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold">
                Every Rig Undergoes Extreme Testing
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Our technicians test battery charge cycles, run unibody structural audits, and verify port integrity before safely packing machines into custom multi-layer electrostatic shock-proof packaging.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Direct Brand Warranty</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 7-Day Replacement Policy</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> GST Invoice & Fast Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-4 max-w-xl">
          <h2 className="text-3xl font-extrabold mb-4">Ready to upgrade your workflow?</h2>
          <p className="text-muted-foreground text-sm mb-8">
            Explore our curated inventory of laptops designed for creators, developers, and esports champions.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all text-sm"
          >
            Explore All Laptops
          </Link>
        </div>
      </section>
    </div>
  );
}
