"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Compass, 
  Map, 
  DollarSign, 
  Calendar, 
  Users, 
  CloudSun, 
  ArrowRight, 
  CheckCircle, 
  ChevronRight,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  Award
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AnimatedBackground } from "@/components/animated-background";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Features dataset
  const features = [
    {
      icon: <Compass className="w-6 h-6 text-blue-500" />,
      title: "AI Travel Discovery",
      desc: "Deep neural matching engine proposing places tailored to your travel history and character preferences."
    },
    {
      icon: <Map className="w-6 h-6 text-purple-500" />,
      title: "Route Intelligence",
      desc: "Multi-objective routing mapping cost, duration, and scenic weights for optimal transit."
    },
    {
      icon: <DollarSign className="w-6 h-6 text-emerald-500" />,
      title: "Budget Optimization",
      desc: "Heuristic calculators providing detailed itemized estimates for stays, food, and sightseeing."
    },
    {
      icon: <Calendar className="w-6 h-6 text-amber-500" />,
      title: "Smart Itineraries",
      desc: "Coordinating multi-agent workflows compile day-by-day itineraries dynamically."
    },
    {
      icon: <Users className="w-6 h-6 text-cyan-500" />,
      title: "Crowd Prediction",
      desc: "Intelligent analytics predicting city densities, keeping you ahead of tourist rushes."
    },
    {
      icon: <CloudSun className="w-6 h-6 text-rose-500" />,
      title: "Weather Insights",
      desc: "Forecast mapping aligning destination weather profiles to active travel periods."
    }
  ];

  // How it works dataset
  const steps = [
    {
      step: "01",
      title: "Answer Questions",
      desc: "Tell us about your starting location, companions, budget limits, and climatic vibes."
    },
    {
      step: "02",
      title: "AI Analysis",
      desc: "Collaborative LangGraph agents structure your travel profile and run calculations."
    },
    {
      step: "03",
      title: "Get Recommendations",
      desc: "Review detailed compatibility match scores, scenic alternatives, and transit routes."
    },
    {
      step: "04",
      title: "Receive Itinerary",
      desc: "Unlock a downloadable day-by-day planner containing maps, cost metrics, and insights."
    }
  ];

  // Testimonials dataset
  const testimonials = [
    {
      quote: "VoyageIQ completely changed how we plan group trips. The route cost engine saved us 25% on train travel!",
      author: "Arjun Sharma",
      role: "Nature Enthusiast",
      avatar: "AS"
    },
    {
      quote: "The budget breakdown and itinerary details felt like they were written by a local concierge. Insanely good.",
      author: "Priya Nair",
      role: "Solo Backpacker",
      avatar: "PN"
    },
    {
      quote: "The multi-agent execution showing background logs was super engaging, and the actual suggestions were 10/10.",
      author: "Siddharth Patel",
      role: "Digital Nomad",
      avatar: "SP"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-purple-500/30">
      
      {/* Decorative Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] glow-purple pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[60%] glow-blue pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[45%] h-[50%] glow-purple pointer-events-none" />

      {/* Floating Header */}
      <nav className="fixed top-4 inset-x-4 max-w-7xl mx-auto z-50 glass rounded-2xl border border-card-border px-6 py-3 flex items-center justify-between shadow-lg">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            VIQ
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
            VoyageIQ<span className="text-purple-600 dark:text-purple-400">.ai</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
          <a href="#features" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">How It Works</a>
          <a href="#testimonials" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Testimonials</a>
        </div>

        {/* CTA and Theme Toggles */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
        </div>

        {/* Mobile Toggle Buttons */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg flex flex-col justify-center px-8 py-16 md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex flex-col gap-6 text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-8">
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
          </div>
          <Link 
            href="/onboarding"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Start Your Journey
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6">
        <AnimatedBackground />
        
        <div className="relative max-w-5xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-600 dark:text-purple-400 text-xs font-bold tracking-wider uppercase mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" /> Powered by LangGraph Agentic Intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6"
          >
            VoyageIQ <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Discover destinations, optimize routes, and generate complete travel plans using AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              href="/onboarding" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-lg shadow-purple-500/25 cursor-pointer"
            >
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-white/80 dark:bg-neutral-900/80 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
            >
              Explore Destinations <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        {/* Small floating indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 hidden md:flex">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Scroll down</span>
          <div className="w-1 h-6 rounded-full bg-neutral-400 animate-bounce" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Engineered for Perfect Travel
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Discover the tools powering our routing calculations and dynamic agent recommendations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="glass p-8 rounded-3xl border border-card-border hover:border-purple-500/20 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-900/80 flex items-center justify-center mb-6 shadow-sm border border-card-border">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto relative">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            Our graph-based processing compiles recommendations in seconds.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="relative flex flex-col p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900/40 border border-card-border"
            >
              <div className="absolute top-4 right-6 text-5xl font-black text-purple-600/10 dark:text-purple-400/10 font-display">
                {step.step}
              </div>
              <h3 className="text-lg font-bold mt-4 mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-500 shrink-0" />
                {step.title}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Loved by Travelers Worldwide
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            See how travelers are using VoyageIQ to optimize their trips.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="glass p-8 rounded-3xl border border-card-border flex flex-col justify-between"
            >
              <p className="text-sm text-neutral-600 dark:text-neutral-300 italic leading-relaxed mb-6">
                &ldquo;{test.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4 border-t border-card-border pt-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {test.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold">{test.author}</h4>
                  <span className="text-xs text-neutral-400">{test.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="border-t border-card-border bg-neutral-50 dark:bg-black/50 py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                VIQ
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                VoyageIQ<span className="text-purple-600">.ai</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-400 max-w-sm mb-4">
              AI-driven multi-agent trip planning, budget estimation, and scenic route optimization graph engines.
            </p>
            <span className="text-xs text-neutral-500">
              &copy; {new Date().getFullYear()} VoyageIQ. All rights reserved.
            </span>
          </div>

          <div>
            <h5 className="font-bold text-sm mb-4">Product</h5>
            <ul className="flex flex-col gap-2 text-sm text-neutral-400">
              <li><a href="#features" className="hover:text-foreground">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-foreground">How it Works</a></li>
              <li><Link href="/onboarding" className="hover:text-foreground">AI Onboarding</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-sm mb-4">Engine Metrics</h5>
            <ul className="flex flex-col gap-2 text-sm text-neutral-400">
              <li><Link href="/dashboard/routes" className="hover:text-foreground">Route Explorer</Link></li>
              <li><a href="/docs" className="hover:text-foreground">API docs</a></li>
              <li><span className="opacity-50">LangGraph Nodes</span></li>
              <li><span className="opacity-50">Dijkstra Solvers</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-sm mb-4">Legal</h5>
            <ul className="flex flex-col gap-2 text-sm text-neutral-400">
              <li><span className="opacity-50">Privacy Policy</span></li>
              <li><span className="opacity-50">Terms of Service</span></li>
              <li><span className="opacity-50">Security Keys</span></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
