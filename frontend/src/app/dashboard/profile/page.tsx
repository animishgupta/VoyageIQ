"use client";

import React, { useState, useEffect, useRef } from "react";
import { User, Award, Compass, TrendingUp, Sparkles, Camera, Upload } from "lucide-react";

export default function Profile() {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState("Traveler");
  const [userEmail, setUserEmail] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const photo = localStorage.getItem("profilePhoto");
    if (photo) setProfilePhoto(photo);
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    if (storedName) setUserName(storedName);
    if (storedEmail) setUserEmail(storedEmail);
  }, []);

  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "??";

  const stats = [
    { label: "Cities Visited", value: "14", icon: <Compass className="w-5 h-5 text-blue-500" /> },
    { label: "Total Distance", value: "4,820 km", icon: <TrendingUp className="w-5 h-5 text-emerald-500" /> },
    { label: "Travel Carbon Saved", value: "124 kg", icon: <Award className="w-5 h-5 text-purple-500" /> }
  ];

  // DiceBear illustrated avatar styles — fun cartoon presets, no real people
  const presetAvatars = [
    { name: "Adventurer", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Siya&backgroundColor=b6e3f4" },
    { name: "Explorer", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rohan&backgroundColor=c0aede" },
    { name: "Mountain", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Priya&backgroundColor=d1d4f9" },
    { name: "Beach", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Arjun&backgroundColor=ffd5dc" },
    { name: "Nomad", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Kavya&backgroundColor=ffdfbf" },
    { name: "Cosmic", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Vikram&backgroundColor=b6e3f4,c0aede" },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem("profilePhoto", base64String);
        setProfilePhoto(base64String);
        window.dispatchEvent(new Event("profilePhotoUpdated"));
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreset = (url: string) => {
    localStorage.setItem("profilePhoto", url);
    setProfilePhoto(url);
    window.dispatchEvent(new Event("profilePhotoUpdated"));
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const saveName = () => {
    if (nameInput.trim()) {
      localStorage.setItem("userName", nameInput.trim());
      setUserName(nameInput.trim());
      window.dispatchEvent(new Event("userUpdated"));
    }
    setEditingName(false);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Traveler Profile</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Review your travel statistics, preference metrics, and AI-determined personality.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="p-8 rounded-3xl bg-card border border-card-border flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[30%] h-[100%] glow-purple opacity-20 pointer-events-none" />
        
        {/* Interactive Avatar Bubble */}
        <div 
          onClick={triggerFileInput}
          className="group relative w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-3xl shrink-0 cursor-pointer overflow-hidden shadow-lg border border-card-border"
        >
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile Photo" className="w-full h-full object-cover rounded-full" />
          ) : (
            <span>{initials}</span>
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-[10px] font-bold text-white">
            <Camera className="w-4 h-4" />
            <span>EDIT</span>
          </div>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handlePhotoUpload} 
        />
        
        <div className="flex-grow text-center sm:text-left">
          {editingName ? (
            <div className="flex items-center gap-2 mb-1">
              <input
                autoFocus
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") setEditingName(false); }}
                placeholder={userName}
                className="text-xl font-black bg-transparent border-b-2 border-purple-500 outline-none w-48"
              />
              <button onClick={saveName} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-600 text-white">Save</button>
              <button onClick={() => setEditingName(false)} className="text-xs font-bold px-2.5 py-1 rounded-lg border border-card-border">Cancel</button>
            </div>
          ) : (
            <button
              onClick={() => { setNameInput(userName); setEditingName(true); }}
              className="group flex items-center gap-2 text-2xl font-black mb-1 hover:text-purple-600 transition-colors"
              title="Click to edit name"
            >
              {userName}
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-400 group-hover:text-purple-500 transition-colors opacity-0 group-hover:opacity-100 text-[10px]">edit</span>
            </button>
          )}
          <span className="text-sm font-semibold text-neutral-400">{userEmail || "No email set"}</span>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              Style: Adventure Explorer
            </span>
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Gold Tier Traveler
            </span>
          </div>
        </div>
      </div>

      {/* Customize Profile Photo Selector */}
      <div className="p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-sm">Customize Profile Avatar</h3>
          <p className="text-xs text-neutral-500 mt-1">Upload a photo or pick an illustrated avatar preset — no real faces!</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-2">
          {/* Upload Button */}
          <button 
            onClick={triggerFileInput}
            className="px-4 py-3 rounded-2xl border border-card-border bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>

          <div className="h-6 w-px bg-card-border" />

          {/* Preset options — illustrated avatars */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase text-neutral-400">Avatar Presets:</span>
            {presetAvatars.map((preset) => (
              <button
                key={preset.name}
                onClick={() => selectPreset(preset.url)}
                className={`w-11 h-11 rounded-full border-2 overflow-hidden hover:scale-110 active:scale-95 transition-transform bg-white ${
                  profilePhoto === preset.url ? "border-purple-500 shadow-md shadow-purple-500/20" : "border-card-border"
                }`}
                title={preset.name}
              >
                <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-card-border flex items-center justify-center">
              {stat.icon}
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                {stat.label}
              </span>
              <span className="text-2xl font-black font-display tracking-tight">
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Travel Preferences Summary */}
      <div className="p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-6">
        <h3 className="font-bold text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" /> Preference Vector (AI Mapped)
        </h3>

        <div className="grid sm:grid-cols-2 gap-4 text-xs font-semibold text-neutral-500">
          <div className="p-4 rounded-xl border border-card-border bg-neutral-50 dark:bg-neutral-900/40 flex items-center justify-between">
            <span>Weather Orientation</span>
            <span className="font-extrabold text-neutral-800 dark:text-neutral-200">Temperate / Cold</span>
          </div>
          <div className="p-4 rounded-xl border border-card-border bg-neutral-50 dark:bg-neutral-900/40 flex items-center justify-between">
            <span>Primary Transit Mode</span>
            <span className="font-extrabold text-neutral-800 dark:text-neutral-200">Train / Bus</span>
          </div>
          <div className="p-4 rounded-xl border border-card-border bg-neutral-50 dark:bg-neutral-900/40 flex items-center justify-between">
            <span>Landscape Preferences</span>
            <span className="font-extrabold text-neutral-800 dark:text-neutral-200">Mountains, Lakes, Forests</span>
          </div>
          <div className="p-4 rounded-xl border border-card-border bg-neutral-50 dark:bg-neutral-900/40 flex items-center justify-between">
            <span>Crowd Tolerance</span>
            <span className="font-extrabold text-neutral-800 dark:text-neutral-200">Low (Quiet exploration)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
