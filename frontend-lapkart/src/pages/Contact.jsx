import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Shield
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const faqs = [
    {
      q: 'How fast will my laptop arrive after placing an order?',
      a: 'Orders are dispatched within 24 hours from our Bangalore fulfillment hub. Delivery typically takes 2–4 business days across major Indian metros and tier-1/tier-2 cities.',
    },
    {
      q: 'Are all laptops brand new and covered by official manufacturer warranties?',
      a: 'Yes, 100%. We source exclusively via authorized brand distributors. All laptops come with sealed manufacturer boxes and full official 1 to 3-year brand warranties registered upon dispatch.',
    },
    {
      q: 'Can I request custom RAM or SSD upgrades before dispatch?',
      a: 'Yes! Select machine configurations support custom expansion. Please select "Hardware Customization" in the form above with your order number, and our lab specialists will reach out.',
    },
    {
      q: 'What is the return or replacement procedure?',
      a: 'We offer an automated 7-day doorstep replacement policy for any technical defects, hardware discrepancies, or transit damage.',
    },
  ];

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full inline-block mb-3">
            Concierge Support
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Contact LapKart
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-3">
            Have questions about system specifications, corporate bulk purchases, or an existing order? Our hardware engineers are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Left Column: Direct Channels & Address */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-foreground">Direct Support Channels</h3>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block font-semibold">Toll-Free Hotline</span>
                    <span className="font-bold text-foreground text-base">+91 (800) 456-7890</span>
                    <span className="text-xs text-muted-foreground block mt-0.5">Mon – Sat: 9:00 AM – 8:00 PM IST</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block font-semibold">Email Desk</span>
                    <span className="font-bold text-foreground block">support@lapkart.com</span>
                    <span className="text-xs text-muted-foreground block">Typical response within 2 business hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block font-semibold">Headquarters & Testing Lab</span>
                    <span className="font-medium text-foreground block">
                      LapKart Technology Solutions Ltd.
                    </span>
                    <span className="text-xs text-muted-foreground block mt-0.5">
                      Plot 14, Tech Park Boulevard, Electronic City Phase 1, Bangalore, Karnataka 560100
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Assurance Box */}
            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 flex items-center gap-4">
              <Shield className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Zero Automated Bots</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  You always speak directly with certified laptop hardware specialists.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-card border rounded-3xl p-6 sm:p-10 shadow-sm">
              <h2 className="text-2xl font-bold mb-2">Send Us an Inquiry</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                Fill in the details below and an engineer will review your request.
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold">Message Received!</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Thank you for reaching out. One of our specialists will follow up at your email address shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: 'general', message: '' });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-full border text-xs font-bold hover:bg-muted transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Subject / Topic *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                    >
                      <option value="general">General Machine Inquiries</option>
                      <option value="specs">Hardware Specs & Thermal Compatibility</option>
                      <option value="order">Order Tracking & Shipping Status</option>
                      <option value="corporate">Corporate / Bulk Procurement</option>
                      <option value="warranty">Warranty Registration Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Message *
                    </label>
                    <textarea
                      rows="4"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what machine configuration or questions you have..."
                      className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:shadow-lg hover:bg-primary/90 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pt-12 border-t">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Instant answers to common questions about buying and owning a LapKart machine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl border bg-card/60 shadow-sm space-y-2">
                <h4 className="font-bold text-sm text-foreground flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
