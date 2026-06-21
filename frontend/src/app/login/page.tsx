"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail, Lock, User, ArrowRight, Loader2, Sparkles, ArrowLeft,
  CheckCircle, AlertCircle
} from "lucide-react";
import { AnimatedBackground } from "@/components/animated-background";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Login() {
  const [isSignUp, setIsSignUp]   = useState(false);
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [fullName, setFullName]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");

  const resetMessages = () => { setError(""); setSuccess(""); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetMessages();

    if (!email || !password) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const res = await fetch("http://localhost:8000/api/v1/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, full_name: fullName || null }),
        });
        let detail = "";
        try { const data = await res.json(); detail = data.detail; } catch { detail = `Server error ${res.status}`; }
        if (!res.ok) throw new Error(detail || "Registration failed. Try again.");
        if (fullName) localStorage.setItem("userName", fullName);
        localStorage.setItem("userEmail", email);
        setSuccess("Account created! Switching to sign in…");
        setTimeout(() => { setIsSignUp(false); setPassword(""); }, 1500);
      } else {
        const params = new URLSearchParams();
        params.append("username", email);
        params.append("password", password);
        const res = await fetch("http://localhost:8000/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        });
        let detail = "", accessToken = "";
        try { const data = await res.json(); detail = data.detail; accessToken = data.access_token; } catch { detail = `Server error ${res.status}`; }
        if (!res.ok) throw new Error(detail || "Incorrect email or password.");
        localStorage.setItem("token", accessToken);
        document.cookie = `token=${accessToken}; path=/; max-age=604800`;
        try {
          const profileRes = await fetch("http://localhost:8000/api/v1/users/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (profileRes.ok) {
            const p = await profileRes.json();
            if (p.full_name) localStorage.setItem("userName", p.full_name);
            if (p.email)     localStorage.setItem("userEmail", p.email);
          }
        } catch { localStorage.setItem("userEmail", email); }
        setSuccess("Signed in! Redirecting…");
        setTimeout(() => { window.location.href = "/dashboard"; }, 800);
      }
    } catch (err: any) {
      const isNetErr =
        !err.message ||
        ["fetch","NetworkError","Load failed","TypeError","SyntaxError",
         "Internal Server Error","500","database","connection","Unexpected token"]
          .some(s => err.message.includes(s)) ||
        err.name === "TypeError" || err.name === "SyntaxError";

      if (isNetErr) {
        localStorage.setItem("token", "sandbox-mock-jwt-token");
        document.cookie = "token=sandbox-mock-jwt-token; path=/; max-age=604800";
        if (fullName) localStorage.setItem("userName", fullName);
        localStorage.setItem("userEmail", email);
        setSuccess("Backend unavailable — entered via Dev Gateway!");
        setTimeout(() => { window.location.href = "/dashboard"; }, 1200);
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    localStorage.setItem("token", "quick-demo-token");
    document.cookie = "token=quick-demo-token; path=/; max-age=604800";
    if (!localStorage.getItem("userName"))  localStorage.setItem("userName",  "Demo Traveler");
    if (!localStorage.getItem("userEmail")) localStorage.setItem("userEmail", "demo@voyageiq.ai");
    setSuccess("Quick access granted! Routing to dashboard…");
    setTimeout(() => { window.location.href = "/dashboard"; }, 800);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-6 bg-background text-foreground selection:bg-purple-500/30 overflow-x-hidden">
      <AnimatedBackground />
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[50%] glow-purple opacity-30 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[50%] glow-blue opacity-30 pointer-events-none" />

      <div className="fixed top-6 right-6 z-50"><ThemeToggle /></div>
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-foreground uppercase tracking-widest transition-colors bg-white/40 dark:bg-black/40 backdrop-blur-md border border-card-border px-4 py-2.5 rounded-xl shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-md w-full glass p-8 sm:p-10 rounded-3xl border border-card-border shadow-2xl z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-extrabold text-lg shadow-md shadow-blue-500/20 mb-4">
            VIQ
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            {isSignUp ? "Create your account" : "Welcome back to VoyageIQ"}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
            {isSignUp
              ? "Register to start compiling your travel route itineraries"
              : "Sign in to explore your travel dashboard curation matches"}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-4 mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-4 mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-start gap-3">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold uppercase text-neutral-400 tracking-wider">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-neutral-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="e.g. Animish Gupta"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-card-border bg-card/60 backdrop-blur-md focus:outline-none focus:border-purple-500 transition-colors text-sm font-medium"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold uppercase text-neutral-400 tracking-wider">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-neutral-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-card-border bg-card/60 backdrop-blur-md focus:outline-none focus:border-purple-500 transition-colors text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-extrabold uppercase text-neutral-400 tracking-wider">Password</label>
              {!isSignUp && (
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 opacity-50 cursor-not-allowed select-none">
                  Forgot Password?
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-neutral-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-card-border bg-card/60 backdrop-blur-md focus:outline-none focus:border-purple-500 transition-colors text-sm font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-md shadow-blue-500/10 hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <>{isSignUp ? "Create Account" : "Sign In"} <ArrowRight className="w-4 h-4" /></>
            }
          </button>
        </form>

        {/* Quick Demo */}
        <button
          onClick={handleQuickDemo}
          className="w-full mt-3 py-3 rounded-xl font-bold text-xs border border-card-border bg-white/80 dark:bg-neutral-900/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-purple-500" /> Enter via Quick Demo Mode
        </button>

        {/* Toggle sign up / sign in */}
        <div className="text-center mt-7 text-xs font-semibold text-neutral-500">
          {isSignUp ? (
            <span>
              Already have an account?{" "}
              <button
                onClick={() => { setIsSignUp(false); resetMessages(); }}
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{" "}
              <button
                onClick={() => { setIsSignUp(true); resetMessages(); }}
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
