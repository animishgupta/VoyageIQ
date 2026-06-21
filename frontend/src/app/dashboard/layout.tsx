"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Compass, Map, Briefcase, Sparkles, User,
  Settings, LogOut, Menu, X, Bell, Image,
  MapPin, TrendingUp, AlertTriangle, CheckCircle2, Plane,
  Star, Clock, Trash2, BellOff
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

// ─── Notification types ───────────────────────────────────────────────────────
interface Notification {
  id: number;
  type: "match" | "alert" | "tip" | "trip" | "promo";
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon?: React.ReactNode;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1, type: "match", read: false,
    title: "New Destination Match — 94%",
    body: "Spiti Valley, Himachal Pradesh matches your offbeat adventure preferences.",
    time: "2 min ago",
  },
  {
    id: 2, type: "alert", read: false,
    title: "Price Drop Alert 🔔",
    body: "Leh–Ladakh flights dropped to ₹4,200 on EaseMyTrip — 38% cheaper than last week.",
    time: "18 min ago",
  },
  {
    id: 3, type: "tip", read: false,
    title: "AI Travel Tip",
    body: "Best time to visit Meghalaya is Oct–Apr. Avoid monsoon for root bridge treks.",
    time: "1 hr ago",
  },
  {
    id: 4, type: "trip", read: true,
    title: "Trip Reminder",
    body: "Your saved trip to Gokarna is upcoming. Review your itinerary in My Trips.",
    time: "3 hr ago",
  },
  {
    id: 5, type: "match", read: true,
    title: "Hidden Gem Discovered",
    body: "Dzukou Valley, Nagaland — 10/10 hidden gem score. Almost no tourists. Perfect for you!",
    time: "Yesterday",
  },
  {
    id: 6, type: "promo", read: true,
    title: "Weekend Getaway Idea",
    body: "Kasol → Kheerganga trek is only 2 days from Delhi. Budget under ₹5,000.",
    time: "Yesterday",
  },
  {
    id: 7, type: "alert", read: true,
    title: "Crowd Warning — Manali",
    body: "Manali is entering peak season. Crowd density is HIGH. Consider Spiti as an alternative.",
    time: "2 days ago",
  },
];

const notifIcon = (type: Notification["type"]) => {
  switch (type) {
    case "match":  return <Star     className="w-4 h-4 text-purple-500" />;
    case "alert":  return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    case "tip":    return <Sparkles className="w-4 h-4 text-blue-500" />;
    case "trip":   return <Plane    className="w-4 h-4 text-emerald-500" />;
    case "promo":  return <MapPin   className="w-4 h-4 text-rose-500" />;
  }
};

const notifColor = (type: Notification["type"]) => {
  switch (type) {
    case "match":  return "bg-purple-500/10 border-purple-500/20";
    case "alert":  return "bg-amber-500/10 border-amber-500/20";
    case "tip":    return "bg-blue-500/10 border-blue-500/20";
    case "trip":   return "bg-emerald-500/10 border-emerald-500/20";
    case "promo":  return "bg-rose-500/10 border-rose-500/20";
  }
};

// ─── Notifications Panel ──────────────────────────────────────────────────────
function NotificationsPanel({
  notifications, onRead, onReadAll, onDelete, onClose
}: {
  notifications: Notification[];
  onRead:    (id: number) => void;
  onReadAll: () => void;
  onDelete:  (id: number) => void;
  onClose:   () => void;
}) {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className="absolute top-full right-0 mt-2 w-[360px] max-w-[calc(100vw-2rem)] bg-card border border-card-border rounded-2xl shadow-2xl shadow-black/20 z-50 overflow-hidden flex flex-col"
      style={{ maxHeight: "80vh" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-card-border bg-gradient-to-r from-purple-500/5 to-blue-500/5">
        <div className="flex items-center gap-2.5">
          <Bell className="w-4 h-4 text-purple-600" />
          <span className="font-extrabold text-sm">Notifications</span>
          {unread > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-600 text-white">
              {unread} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button
              onClick={onReadAll}
              className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-grow">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-neutral-400">
            <BellOff className="w-10 h-10 opacity-30" />
            <p className="text-xs font-semibold">No notifications yet</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-card-border">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onRead(n.id)}
                className={`relative flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors group ${
                  n.read
                    ? "hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
                    : "bg-purple-500/[0.03] hover:bg-purple-500/[0.06]"
                }`}
              >
                {/* Unread dot */}
                {!n.read && (
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                )}

                {/* Icon */}
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${notifColor(n.type)}`}>
                  {notifIcon(n.type)}
                </div>

                {/* Text */}
                <div className="flex-grow min-w-0">
                  <p className={`text-xs leading-snug ${n.read ? "font-semibold text-neutral-600 dark:text-neutral-400" : "font-extrabold text-neutral-800 dark:text-neutral-100"}`}>
                    {n.title}
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed line-clamp-2">
                    {n.body}
                  </p>
                  <span className="text-[9px] font-bold text-neutral-300 dark:text-neutral-600 mt-1 block flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 inline" /> {n.time}
                  </span>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(n.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-500/10 text-neutral-300 hover:text-rose-500 transition-all shrink-0 mt-0.5"
                  title="Dismiss"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-card-border bg-card/80 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm("Clear all notifications?")) {
                notifications.forEach(n => onDelete(n.id));
              }
            }}
            className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 hover:text-rose-500 transition-colors"
          >
            <Trash2 className="w-3 h-3" /> Clear all
          </button>
          <span className="text-[9px] font-bold text-neutral-300 dark:text-neutral-600">
            {notifications.length} total · {unread} unread
          </span>
        </div>
      )}
    </motion.div>
  );
}

// ─── Dashboard Layout ─────────────────────────────────────────────────────────
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [userName,  setUserName]  = useState("Traveler");
  const [userEmail, setUserEmail] = useState("");

  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close panel when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on route change
  useEffect(() => { setNotifOpen(false); }, [pathname]);

  const markRead    = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = ()           => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const deleteNotif = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id));

  // User data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/login"; return; }
    const storedName  = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    if (storedName)  setUserName(storedName);
    if (storedEmail) setUserEmail(storedEmail);
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      setProfilePhoto(localStorage.getItem("profilePhoto"));
      const n = localStorage.getItem("userName");
      const e = localStorage.getItem("userEmail");
      if (n) setUserName(n);
      if (e) setUserEmail(e);
    };
    window.addEventListener("profilePhotoUpdated", handleUpdate);
    window.addEventListener("userUpdated", handleUpdate);
    handleUpdate();
    return () => {
      window.removeEventListener("profilePhotoUpdated", handleUpdate);
      window.removeEventListener("userUpdated", handleUpdate);
    };
  }, []);

  const initials = userName.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "??";

  const menuItems = [
    { name: "Home",              href: "/dashboard",             icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Discover",          href: "/dashboard/discover",    icon: <Compass  className="w-5 h-5" /> },
    { name: "InstaTravel Finder",href: "/dashboard/instatravel", icon: <Image    className="w-5 h-5" /> },
    { name: "Route Explorer",    href: "/dashboard/routes",      icon: <Map      className="w-5 h-5" /> },
    { name: "My Trips & Saves",  href: "/dashboard/trips",       icon: <Briefcase className="w-5 h-5" /> },
    { name: "AI Insights",       href: "/dashboard/insights",    icon: <Sparkles className="w-5 h-5" /> },
    { name: "Profile",           href: "/dashboard/profile",     icon: <User     className="w-5 h-5" /> },
    { name: "Settings",          href: "/dashboard/settings",    icon: <Settings className="w-5 h-5" /> },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between py-6 px-4 bg-card border-r border-card-border text-foreground">
      <div className="flex flex-col gap-8">
        <Link href="/" className="flex items-center gap-2 px-2 py-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs">VIQ</div>
          <span className="font-extrabold text-lg tracking-tight">VoyageIQ<span className="text-purple-600">.ai</span></span>
        </Link>

        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all ${
                  active
                    ? "bg-purple-500/5 text-purple-600 dark:text-purple-400 border border-purple-500/10"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-foreground"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-4 border-t border-card-border pt-6">
        <div className="flex items-center gap-3 px-2">
          {profilePhoto ? (
            <img src={profilePhoto} alt={initials} className="w-10 h-10 rounded-full object-cover border border-card-border shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initials}
            </div>
          )}
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold text-sm truncate">{userName}</span>
            <span className="text-xs text-neutral-400 truncate">{userEmail}</span>
          </div>
        </div>
        <Link
          href="/"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("profilePhoto");
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          }}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-500/5 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen fixed top-0 left-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-black"
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="absolute top-0 left-0 w-64 h-full"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-grow min-h-screen lg:pl-64 flex flex-col">

        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-card-border">

          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl border border-card-border hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">VoyageIQ Planner</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Bell button + panel */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(prev => !prev)}
                className={`p-2.5 rounded-xl border border-card-border bg-card text-neutral-500 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all relative ${notifOpen ? "border-purple-500/30 bg-purple-500/5 text-purple-600" : ""}`}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-purple-600 text-white text-[9px] font-black flex items-center justify-center px-1"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <NotificationsPanel
                    notifications={notifications}
                    onRead={markRead}
                    onReadAll={markAllRead}
                    onDelete={deleteNotif}
                    onClose={() => setNotifOpen(false)}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
