"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Moon, Users, CheckCircle, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed w-full z-50 glass">
        <div className="container h-16 flex items-center justify-between">
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            AutoGram
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-gray-300 hover:text-white transition-colors">Pricing</a>
            <Link href="/login" className="btn btn-primary text-sm px-4 py-2 rounded-lg">
              Login
            </Link>
          </div>
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-t border-gray-800">
            <div className="container py-4 space-y-3">
              <a href="#features" className="block text-gray-300 hover:text-white transition-colors py-2">Features</a>
              <a href="#pricing" className="block text-gray-300 hover:text-white transition-colors py-2">Pricing</a>
              <Link href="/login" className="btn btn-primary w-full justify-center mt-2">
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4">
        <div className="container grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.span variants={itemVariants} className="badge">
              🚀 Telegram Automation SaaS
            </motion.span>
            <motion.h1 variants={itemVariants} className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6">
              Automate Telegram Ads <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                Safely & Professionally
              </span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-base md:text-lg text-gray-400 mb-6 md:mb-8 max-w-xl">
              Forward ads to multiple groups using your own Telegram account. Built-in delays, night mode,
              and guardrails to keep your account safe while you scale.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
              <Link href="/login" className="btn btn-primary text-base md:text-lg justify-center sm:justify-start">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#pricing" className="btn btn-ghost border border-gray-700 rounded-lg justify-center sm:justify-start">
                View Pricing
              </a>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 md:mt-12 flex flex-wrap gap-4 md:gap-8 text-xs md:text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" /> Official Login
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" /> Smart Delays
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative mt-8 lg:mt-0"
          >
            <div className="glass p-6 md:p-8 rounded-2xl border border-gray-800 relative z-10 bg-slate-900/50">
              <div className="grid grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="bg-slate-800/50 p-3 md:p-4 rounded-xl">
                  <div className="text-gray-400 text-xs md:text-sm mb-1">Delivery Rate</div>
                  <div className="text-xl md:text-2xl font-bold text-green-400">99.2%</div>
                </div>
                <div className="bg-slate-800/50 p-3 md:p-4 rounded-xl">
                  <div className="text-gray-400 text-xs md:text-sm mb-1">Active Accounts</div>
                  <div className="text-xl md:text-2xl font-bold text-indigo-400">1,240+</div>
                </div>
              </div>
              <div className="space-y-3 md:space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 md:p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <div className="flex-1 h-2 bg-slate-700 rounded w-full" />
                    <div className="w-8 md:w-12 h-2 bg-slate-700 rounded" />
                  </div>
                ))}
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/20 blur-3xl -z-10 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 md:py-20 bg-slate-900/50">
        <div className="container px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Why Choose AutoGram?</h2>
            <p className="text-sm md:text-base text-gray-400">Built for marketers who value account safety.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <FeatureCard
              icon={<Shield className="w-6 h-6 md:w-8 md:h-8 text-indigo-400" />}
              title="Official Login"
              desc="OTP based Telegram login. No password stored. Full control stays with you."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />}
              title="Safe Forwarding"
              desc="Minimum 20-minute gap with smart scheduling to avoid Telegram bans."
            />
            <FeatureCard
              icon={<Moon className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />}
              title="Night Mode"
              desc="Automatically pause forwarding during night hours to mimic human behavior."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 md:w-8 md:h-8 text-green-400" />}
              title="Team Ready"
              desc="Invite teammates, separate workspaces, and track who changed what."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-12 md:py-20 px-4">
        <div className="container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Simple Pricing</h2>
            <p className="text-sm md:text-base text-gray-400">Start for free, upgrade when you scale.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className="glass p-6 md:p-8 rounded-2xl border border-gray-800 flex flex-col">
              <h3 className="text-lg md:text-xl font-bold mb-2">Free Trial</h3>
              <div className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">₹0<span className="text-xs md:text-sm text-gray-500 font-normal">/7 days</span></div>
              <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm md:text-base"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-500" /> 2 Groups</li>
                <li className="flex items-center gap-3 text-sm md:text-base"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-500" /> 7 Days Access</li>
                <li className="flex items-center gap-3 text-sm md:text-base"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-500" /> Fixed Delay</li>
              </ul>
              <Link href="/login" className="btn btn-ghost border border-gray-700 w-full justify-center">Start Free</Link>
            </div>

            <div className="glass p-6 md:p-8 rounded-2xl border border-indigo-500/30 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 bg-indigo-600 text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
              <h3 className="text-lg md:text-xl font-bold mb-2">Pro</h3>
              <div className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">₹99<span className="text-xs md:text-sm text-gray-500 font-normal">/month</span></div>
              <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm md:text-base"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" /> 10 Groups</li>
                <li className="flex items-center gap-3 text-sm md:text-base"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" /> Custom Delay</li>
                <li className="flex items-center gap-3 text-sm md:text-base"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" /> Night Mode</li>
                <li className="flex items-center gap-3 text-sm md:text-base"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" /> Priority Support</li>
              </ul>
              <Link href="/login" className="btn btn-primary w-full justify-center">Get Started</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-6 md:py-8 border-t border-gray-800 text-center text-gray-500 text-xs md:text-sm px-4">
        <div className="container">
          © 2026 AutoGram · Built for Professionals
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="glass p-5 md:p-6 rounded-xl border border-gray-800 hover:border-indigo-500/50 transition-colors group">
      <div className="mb-3 md:mb-4 bg-slate-800 w-fit p-2 md:p-3 rounded-lg group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-base md:text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
