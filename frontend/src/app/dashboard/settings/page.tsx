"use client";

import React, { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Settings, 
  Shield, 
  Bell, 
  Globe, 
  User, 
  Key, 
  Lock, 
  Trash2, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Briefcase
} from "lucide-react";

export default function SettingsPage() {
  // Travel Preferences States
  const [travelStyle, setTravelStyle] = useState("Balanced");
  const [transportMode, setTransportMode] = useState("Flight");
  const [hotelVibe, setHotelVibe] = useState("Boutique Hotels");

  // AI Configuration States
  const [aiResponseLength, setAiResponseLength] = useState("Standard");
  const [groqApiKey, setGroqApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeySaved, setApiKeySaved] = useState(false);

  // Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification States
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  // Localization States
  const [language, setLanguage] = useState("English (US)");
  const [currency, setCurrency] = useState("INR (₹)");

  // Message alert states
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "">("");

  // Load preferences from localStorage on mount
  useEffect(() => {
    // Travel Preferences
    const style = localStorage.getItem("settingTravelStyle");
    if (style) setTravelStyle(style);
    const transport = localStorage.getItem("settingTransportMode");
    if (transport) setTransportMode(transport);
    const vibe = localStorage.getItem("settingHotelVibe");
    if (vibe) setHotelVibe(vibe);

    const responseLen = localStorage.getItem("settingAiResponseLength");
    if (responseLen) setAiResponseLength(responseLen);

    const savedKey = localStorage.getItem("groqApiKey");
    if (savedKey) setGroqApiKey(savedKey);

    // Notifications
    const emailNotif = localStorage.getItem("settingEmailNotifications");
    if (emailNotif) setEmailNotifications(emailNotif === "true");
    const pushNotif = localStorage.getItem("settingPushNotifications");
    if (pushNotif) setPushNotifications(pushNotif === "true");

    // Localization
    const lang = localStorage.getItem("settingLanguage");
    if (lang) setLanguage(lang);
    const curr = localStorage.getItem("settingCurrency");
    if (curr) setCurrency(curr);
  }, []);

  const triggerAlert = (msg: string, type: "success" | "error") => {
    setAlertMessage(msg);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 3000);
  };

  // Save Travel & AI settings
  const handleSavePreferences = () => {
    try {
      localStorage.setItem("settingTravelStyle", travelStyle);
      localStorage.setItem("settingTransportMode", transportMode);
      localStorage.setItem("settingHotelVibe", hotelVibe);
      localStorage.setItem("settingAiResponseLength", aiResponseLength);

      triggerAlert("Preferences saved successfully!", "success");
    } catch (e) {
      triggerAlert("Failed to save preferences.", "error");
    }
  };

  // Save Notifications & General Toggle Settings
  const handleToggleEmail = () => {
    const nextVal = !emailNotifications;
    setEmailNotifications(nextVal);
    handleSaveGeneral("settingEmailNotifications", String(nextVal));
  };

  const handleTogglePush = () => {
    const nextVal = !pushNotifications;
    setPushNotifications(nextVal);
    handleSaveGeneral("settingPushNotifications", String(nextVal));
  };

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setLanguage(val);
    handleSaveGeneral("settingLanguage", val);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCurrency(val);
    handleSaveGeneral("settingCurrency", val);
  };

  const handleSaveGeneral = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      triggerAlert("Settings updated!", "success");
    } catch (e) {
      triggerAlert("Failed to update setting.", "error");
    }
  };

  // Change Password Mock
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      triggerAlert("Please fill in all password fields.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerAlert("New passwords do not match.", "error");
      return;
    }
    
    // Mock success
    triggerAlert("Password updated successfully!", "success");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // Reset App Data
  const handleResetAppData = () => {
    if (confirm("Are you sure you want to clear all planned trips, bookmarks, settings, and profile data? This will log you out!")) {
      localStorage.clear();
      triggerAlert("All app data cleared! Logging out...", "success");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Configure application interface metrics, AI overrides, travel preferences, and metadata profiles.
        </p>
      </div>

      {/* Floating Alert Messages */}
      {alertMessage && (
        <div className={`fixed bottom-6 right-6 p-4 rounded-2xl border shadow-xl flex items-center gap-3 z-50 animate-slide-up ${
          alertType === "success" 
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
            : "bg-rose-500/10 border-rose-500/20 text-rose-500"
        }`}>
          {alertType === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-xs font-extrabold">{alertMessage}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Settings Links */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Section: Interface & Preferences */}
          <div className="p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/5 text-purple-600 border border-purple-500/10 flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-extrabold text-sm">Theme Selection</h3>
                <span className="text-xs text-neutral-400 mt-0.5">Toggle between Dark Mode and Light Mode</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t border-card-border/60 pt-4 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              <span>Selected Theme</span>
              <ThemeToggle />
            </div>
          </div>

          {/* Section: Travel Profile & Style */}
          <div className="p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/5 text-blue-600 border border-blue-500/10 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-extrabold text-sm">Travel Profile & Style</h3>
                <span className="text-xs text-neutral-400 mt-0.5">Define your default onboarding and recommendation parameters</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 border-t border-card-border/60 pt-4 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>Default Travel Style</span>
                <select 
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="p-2.5 rounded-xl border border-card-border bg-background text-xs font-semibold focus:outline-none"
                >
                  <option value="Budget">Budget (Under ₹15k)</option>
                  <option value="Balanced">Balanced (₹25k - ₹50k)</option>
                  <option value="Luxury">Luxury (₹50k+)</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>Preferred Transit Mode</span>
                <select 
                  value={transportMode}
                  onChange={(e) => setTransportMode(e.target.value)}
                  className="p-2.5 rounded-xl border border-card-border bg-background text-xs font-semibold focus:outline-none"
                >
                  <option value="Flight">Flight (Fastest)</option>
                  <option value="Train">Express Train (Scenic)</option>
                  <option value="Bus">Volvo Sleeper Bus (Budget)</option>
                  <option value="Cab">AC Road Cab (Private)</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>Lodging Preference</span>
                <select 
                  value={hotelVibe}
                  onChange={(e) => setHotelVibe(e.target.value)}
                  className="p-2.5 rounded-xl border border-card-border bg-background text-xs font-semibold focus:outline-none"
                >
                  <option value="Hostels">Homestays & Hostels</option>
                  <option value="Boutique Hotels">Boutique Stays</option>
                  <option value="Luxury Resorts">5-Star Luxury Resorts</option>
                </select>
              </div>
              
              <button 
                onClick={handleSavePreferences}
                className="mt-2 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md shadow-purple-500/10 cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>

          {/* Section: AI Configuration */}
          <div className="p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/5 text-amber-600 border border-amber-500/10 flex items-center justify-center shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-extrabold text-sm">AI Agent Configuration</h3>
                <span className="text-xs text-neutral-400 mt-0.5">Customize LLM parameters and response details for AI Insights</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 border-t border-card-border/60 pt-4 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-1">
                <span>AI Insights Detail Level</span>
                <select 
                  value={aiResponseLength}
                  onChange={(e) => setAiResponseLength(e.target.value)}
                  className="p-2.5 rounded-xl border border-card-border bg-background text-xs font-semibold focus:outline-none"
                >
                  <option value="Concise">Concise & Fast</option>
                  <option value="Standard">Standard (Recommended)</option>
                  <option value="Detailed">Comprehensive Research</option>
                </select>
              </div>

              {/* Groq API Key field */}
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5" /> Groq API Key
                  </span>
                  <a 
                    href="https://console.groq.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[9px] font-black text-amber-600 underline hover:text-amber-500"
                  >
                    Get free key →
                  </a>
                </div>
                <p className="text-[10px] text-neutral-400">Required for all AI features: chat, mood insights, trip names, local secrets, upgrade suggestions, and image recognition.</p>
                <div className="flex gap-2 mt-1">
                  <div className="relative flex-grow">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={groqApiKey}
                      onChange={(e) => setGroqApiKey(e.target.value)}
                      placeholder="gsk_..."
                      className="w-full px-3 py-2.5 pr-10 rounded-xl border border-amber-500/20 bg-background text-xs font-mono focus:outline-none focus:border-amber-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(v => !v)}
                      className="absolute inset-y-0 right-2 flex items-center text-neutral-400 hover:text-foreground cursor-pointer"
                    >
                      {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.setItem("groqApiKey", groqApiKey);
                      setApiKeySaved(true);
                      setTimeout(() => setApiKeySaved(false), 2000);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs transition-all cursor-pointer shrink-0"
                  >
                    {apiKeySaved ? "✓ Saved" : "Save Key"}
                  </button>
                </div>
                {groqApiKey && <p className="text-[9px] text-emerald-500 font-bold">✓ Key configured – all AI features are active</p>}
              </div>

              <button 
                onClick={handleSavePreferences}
                className="mt-2 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md shadow-purple-500/10 cursor-pointer"
              >
                Save AI Configurations
              </button>
            </div>
          </div>

          {/* Notifications Toggle */}
          <div className="p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/5 text-blue-600 border border-blue-500/10 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-extrabold text-sm">Notification Channels</h3>
                <span className="text-xs text-neutral-400 mt-0.5">Receive route warnings and seasonal alerts</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 border-t border-card-border/60 pt-4 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              <div className="flex items-center justify-between">
                <span>Email Notifications</span>
                <input 
                  type="checkbox" 
                  checked={emailNotifications}
                  onChange={handleToggleEmail}
                  className="accent-purple-600 cursor-pointer" 
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Push Updates</span>
                <input 
                  type="checkbox" 
                  checked={pushNotifications}
                  onChange={handleTogglePush}
                  className="accent-purple-600 cursor-pointer" 
                />
              </div>
            </div>
          </div>

          {/* Regional Settings */}
          <div className="p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/5 text-emerald-600 border border-emerald-500/10 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-extrabold text-sm">Language & Currency</h3>
                <span className="text-xs text-neutral-400 mt-0.5">Select your localization metrics</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-card-border/60 pt-4 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>Primary Language</span>
                <select 
                  value={language} 
                  onChange={handleLangChange}
                  className="p-2.5 rounded-xl border border-card-border bg-background text-xs font-semibold focus:outline-none"
                >
                  <option value="English (US)">English (US)</option>
                  <option value="Hindi (IN)">Hindi (IN)</option>
                  <option value="Japanese (JP)">Japanese (JP)</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>Display Currency</span>
                <select 
                  value={currency} 
                  onChange={handleCurrencyChange}
                  className="p-2.5 rounded-xl border border-card-border bg-background text-xs font-semibold focus:outline-none"
                >
                  <option value="INR (₹)">INR (₹)</option>
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Security / Update Password */}
          <div className="p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/5 text-rose-600 border border-rose-500/10 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-extrabold text-sm">Change Credentials</h3>
                <span className="text-xs text-neutral-400 mt-0.5">Modify password parameters for your login account</span>
              </div>
            </div>
            
            <form onSubmit={handleChangePassword} className="flex flex-col gap-4 border-t border-card-border/60 pt-4 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>Current Password</span>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="p-2.5 rounded-xl border border-card-border bg-background text-xs font-semibold focus:outline-none w-full sm:max-w-xs"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>New Password</span>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="p-2.5 rounded-xl border border-card-border bg-background text-xs font-semibold focus:outline-none w-full sm:max-w-xs"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>Confirm New Password</span>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="p-2.5 rounded-xl border border-card-border bg-background text-xs font-semibold focus:outline-none w-full sm:max-w-xs"
                />
              </div>

              <button 
                type="submit"
                className="mt-2 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md shadow-purple-500/10 cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </div>

        </div>

        {/* Sidebar Info & Action Cards */}
        <div className="flex flex-col gap-6 self-start">
          
          {/* Privacy info card */}
          <div className="p-6 rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-card-border flex flex-col gap-4">
            <Shield className="w-8 h-8 text-neutral-400" />
            <h4 className="font-extrabold text-sm">Security & Privacy</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              VoyageIQ values your credentials. All data is processed using local vector structures. API connections utilize secure headers.
            </p>
          </div>

          {/* Account deletion card */}
          <div className="p-6 rounded-3xl border border-rose-500/20 bg-rose-500/5 flex flex-col gap-4">
            <Trash2 className="w-8 h-8 text-rose-500" />
            <h4 className="font-extrabold text-sm text-rose-500">System Cache & Reset</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Clearing the database cache will permanently erase your planned itineraries, saved locations, search histories, and login profiles.
            </p>
            <button 
              onClick={handleResetAppData}
              className="mt-2 w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-rose-600/10"
            >
              Reset All Application Data
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
