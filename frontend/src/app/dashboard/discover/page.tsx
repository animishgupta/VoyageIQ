"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Compass, DollarSign, Users, CloudSun,
  Bookmark, BookmarkCheck, Sparkles, Loader2, Plus, RefreshCw
} from "lucide-react";
import { groqAsk } from "@/lib/groq";
import { ALL_DESTINATIONS, CATEGORIES, generateGroqDestinations, getDestImage, type Destination } from "@/lib/destinations";

type DisplayDest = Destination & { computedMatch: number };

const MOOD_TAGS: Record<string, string[]> = {
  "Burned Out":  ["relaxing","nature","spiritual"],
  "Adventurous": ["adventure","offbeat","wildlife"],
  "Romantic":    ["romantic","luxury","relaxing"],
  "Lonely":      ["cultural","spiritual","budget"],
  "Excited":     ["adventure","nature","offbeat"],
  "Stressed":    ["relaxing","nature","spiritual"],
};
const MOOD_CATEGORY: Record<string, string[]> = {
  "Burned Out":  ["Forests","Lakes","Spiritual"],
  "Adventurous": ["Mountains","Snow","Islands","Wildlife"],
  "Romantic":    ["Beaches","Lakes","Historic"],
  "Lonely":      ["Beaches","Historic","Spiritual"],
  "Excited":     ["Beaches","Snow","Islands","Mountains"],
  "Stressed":    ["Lakes","Forests","Spiritual"],
};

const moods = [
  {id:"Burned Out",label:"🥱 Burned Out"},
  {id:"Adventurous",label:"🧗 Adventurous"},
  {id:"Romantic",label:"💖 Romantic"},
  {id:"Lonely",label:"👥 Lonely"},
  {id:"Excited",label:"🤪 Excited"},
  {id:"Stressed",label:"🤯 Stressed"},
];

export default function Discover() {
  const [search, setSearch]               = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [saved, setSaved]                 = useState<string[]>([]);
  const [selectedMood, setSelectedMood]   = useState<string|null>(null);
  const [moodInsight, setMoodInsight]     = useState<string|null>(null);
  const [moodLoading, setMoodLoading]     = useState(false);
  const [aiExtras, setAiExtras]           = useState<DisplayDest[]>([]);
  const [aiLoading, setAiLoading]         = useState(false);
  const [aiError, setAiError]             = useState<string|null>(null);

  useEffect(()=>{
    const list = localStorage.getItem("savedDestinations");
    if (list) setSaved(JSON.parse(list));
  },[]);

  // Groq mood insight
  useEffect(()=>{
    if (!selectedMood) { setMoodInsight(null); return; }
    setMoodLoading(true); setMoodInsight(null);
    groqAsk(
      `I'm feeling ${selectedMood} and want to travel. In 1-2 sentences, suggest the perfect type of destination and why it suits this mood. Be specific, vivid, and mention real Indian places.`,
      "You are VoyageIQ, an expert Indian travel AI. Give brief, vivid, personalized advice.",
      {temperature:0.8,maxTokens:130}
    ).then(t=>setMoodInsight(t)).catch(()=>setMoodInsight(null)).finally(()=>setMoodLoading(false));
  },[selectedMood]);

  const toggleBookmark = (name:string) => {
    const updated = saved.includes(name) ? saved.filter(s=>s!==name) : [...saved,name];
    setSaved(updated);
    localStorage.setItem("savedDestinations",JSON.stringify(updated));
  };

  // Build display list from static DB with mood boosts
  const baseList: DisplayDest[] = ALL_DESTINATIONS.map(d=>{
    let boost = 0;
    if (selectedMood && MOOD_CATEGORY[selectedMood]?.includes(d.category)) boost += 5;
    if (selectedMood && MOOD_TAGS[selectedMood]?.some(t=>d.tags.includes(t))) boost += 3;
    return {...d, computedMatch: Math.min(99, d.match+boost)};
  });

  const filtered = [...baseList, ...aiExtras].filter(d=>{
    const q = search.toLowerCase();
    const matchSearch = !q || d.name.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q) || d.state.toLowerCase().includes(q) || d.tags.some(t=>t.includes(q));
    const matchCat = activeCategory==="All" || d.category===activeCategory;
    return matchSearch && matchCat;
  }).sort((a,b)=>b.computedMatch-a.computedMatch);

  // Groq AI load more
  const loadMoreWithAI = async () => {
    setAiLoading(true); setAiError(null);
    const apiKey = localStorage.getItem("groqApiKey") || process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
    if (!apiKey) { setAiError("Set your Groq API key in Settings to load AI destinations."); setAiLoading(false); return; }
    try {
      const moodPart = selectedMood ? `The user is feeling ${selectedMood}.` : "";
      const catPart  = activeCategory!=="All" ? `Focus on ${activeCategory} destinations.` : "";
      const prompt = `${moodPart} ${catPart} Recommend 8 unique Indian travel destinations that are offbeat, hidden, or underrated. Mix well-known with very obscure ones. Include places from Northeast India, Central India, and coastal India that most tourists don't know about.`;
      const results = await generateGroqDestinations(prompt, apiKey, 8);
      const newDests: DisplayDest[] = results.map((r:any)=>({
        name: r.name||"Unknown",
        state: r.state||"India",
        category: r.category||"Mountains",
        tags: r.tags||[],
        cost: r.cost||"₹10,000",
        crowd: (r.crowd||"Low") as "Low"|"Medium"|"High",
        weather: r.weather||"Temperate",
        match: r.match||82,
        image: getDestImage(r.name||"unknown"),
        desc: r.desc||"A beautiful destination.",
        hiddenGemScore: r.hiddenGemScore||7,
        isIndia: true,
        computedMatch: Math.min(99,(r.match||82)+(selectedMood && MOOD_CATEGORY[selectedMood]?.includes(r.category)?5:0)),
      }));
      setAiExtras(prev=>[...prev,...newDests]);
    } catch(e:any) {
      setAiError("AI failed to load more destinations. Try again.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Discover Destinations</h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
          {ALL_DESTINATIONS.length}+ destinations · AI-powered mood matching · Hidden gems included
        </p>
      </div>

      {/* Mood */}
      <div className="p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-3 shadow-sm">
        <label className="text-xs font-extrabold uppercase text-neutral-400 tracking-wider">How are you feeling right now?</label>
        <div className="flex flex-wrap gap-2.5">
          {moods.map(mood=>{
            const active = selectedMood===mood.id;
            return (
              <button key={mood.id} onClick={()=>setSelectedMood(prev=>prev===mood.id?null:mood.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none ${
                  active?"bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-600/10":"bg-background border-card-border hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-300"
                }`}>{mood.label}</button>
            );
          })}
        </div>
        {selectedMood && (
          <div className="mt-1 flex items-start gap-2 p-3.5 rounded-2xl bg-purple-500/5 border border-purple-500/10 text-xs text-purple-700 dark:text-purple-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-purple-500" />
            {moodLoading
              ? <span className="flex items-center gap-1.5 text-neutral-400"><Loader2 className="w-3 h-3 animate-spin" />AI is reading your mood...</span>
              : <span>{moodInsight||"Select a mood for personalized AI travel suggestions."}</span>}
          </div>
        )}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-400"><Search className="w-5 h-5" /></span>
          <input type="text" placeholder="Search destinations, states, vibes, tags..."
            value={search} onChange={e=>setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-card-border bg-card focus:outline-none focus:border-purple-500 transition-colors text-sm font-semibold shadow-sm" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {CATEGORIES.map(cat=>(
            <button key={cat} onClick={()=>setActiveCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                activeCategory===cat?"bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400":"bg-card border-card-border hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-300"
              }`}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-neutral-400">{filtered.length} destinations found</p>
        {aiExtras.length > 0 && (
          <button onClick={()=>setAiExtras([])} className="text-[10px] font-bold text-neutral-400 hover:text-rose-500 transition-colors">
            Clear AI extras
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dest,idx)=>{
            const isBookmarked = saved.includes(dest.name);
            return (
              <div key={`${dest.name}-${idx}`}
                className="rounded-3xl border border-card-border bg-card overflow-hidden flex flex-col justify-between hover:scale-[1.01] hover:border-purple-500/15 transition-all duration-300 group shadow-sm">
                <div className="h-44 w-full relative overflow-hidden">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute top-4 left-4 text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-md">{dest.computedMatch}% MATCH</span>
                  <button onClick={()=>toggleBookmark(dest.name)}
                    className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/95 dark:bg-black/95 border border-card-border text-neutral-800 dark:text-neutral-200 hover:scale-105 active:scale-95 transition-all shadow-md">
                    {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-purple-500 fill-purple-500" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm border border-white/10">{dest.category}</span>
                    {dest.hiddenGemScore >= 8 && <span className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-purple-600/80 text-white">💎 Hidden Gem</span>}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{dest.name}</h3>
                      <span className="text-[9px] font-bold text-neutral-400 shrink-0 mt-1">{dest.state}</span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">{dest.desc}</p>
                    {dest.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {dest.tags.slice(0,3).map(t=>(
                          <span key={t} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2.5 border-t border-card-border pt-4 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-emerald-500" />Est. Cost</span><span className="font-black text-neutral-800 dark:text-neutral-100">{dest.cost}</span></div>
                    <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-500" />Crowd</span><span className="font-bold">{dest.crowd}</span></div>
                    <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><CloudSun className="w-4 h-4 text-amber-500" />Weather</span><span className="font-bold">{dest.weather}</span></div>
                    <div className="flex flex-col gap-1 border-t border-card-border/60 pt-3 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="text-[8px] font-black uppercase text-neutral-400 tracking-wider">Why we selected this:</span>
                      <span>✓ Matches {dest.category.toLowerCase()} travel landscape</span>
                      <span>✓ Hidden gem score: {dest.hiddenGemScore}/10</span>
                      {selectedMood && <span className="text-purple-500">✓ Complements {selectedMood} mood</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-card border border-card-border rounded-3xl gap-4">
          <Compass className="w-12 h-12 text-neutral-400" />
          <h3 className="font-extrabold text-base">No destinations found</h3>
          <p className="text-xs text-neutral-500">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* AI Load More */}
      <div className="flex flex-col items-center gap-3 pt-2">
        {aiError && <p className="text-xs text-rose-500 font-semibold">{aiError}</p>}
        <button onClick={loadMoreWithAI} disabled={aiLoading}
          className="px-8 py-4 rounded-2xl font-bold text-sm border border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 text-purple-600 dark:text-purple-400 transition-all flex items-center gap-2.5 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-sm">
          {aiLoading
            ? <><Loader2 className="w-4 h-4 animate-spin" />Groq AI finding hidden gems...</>
            : <><Sparkles className="w-4 h-4" />Load More with AI — Discover Hidden Gems</>}
        </button>
        <p className="text-[10px] text-neutral-400">Powered by Groq · Finds offbeat destinations you won't find on mainstream travel sites</p>
      </div>
    </div>
  );
}
