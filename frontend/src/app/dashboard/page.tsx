"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  MapPin, 
  DollarSign, 
  Users, 
  CloudSun, 
  Clock, 
  Train, 
  Compass,
  ArrowRight,
  Plus
} from "lucide-react";
import Link from "next/link";
import { ALL_DESTINATIONS, getDestImage } from "@/lib/destinations";

export default function DashboardHome() {
  const [firstName, setFirstName] = React.useState("Traveler");
  const [personality, setPersonality] = React.useState("Adventure Explorer");
  const [personalityDesc, setPersonalityDesc] = React.useState(
    "You seek mountainous trails, moderate budgets, and active transport routes. You favor offbeat scenic segments."
  );
  const [recommendations, setRecommendations] = React.useState<any[]>([]);
  const [budgetBreakdown, setBudgetBreakdown] = React.useState<any[]>([]);
  const [aiInsights, setAiInsights] = React.useState<any[]>([]);
  const [recentTrips, setRecentTrips] = React.useState<any[]>([]);
  const [bestHotelDeals, setBestHotelDeals] = React.useState<any[]>([]);
  const [bestTransitDeals, setBestTransitDeals] = React.useState<any[]>([]);
  const [compareDestName, setCompareDestName] = React.useState("Srinagar, Kashmir");

  React.useEffect(() => {
    // 1. Get user name
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setFirstName(storedName.split(" ")[0]);
    }
    const handleUpdate = () => {
      const updated = localStorage.getItem("userName");
      if (updated) setFirstName(updated.split(" ")[0]);
    };
    window.addEventListener("userUpdated", handleUpdate);

    // 2. Get onboarding result
    try {
      const onboardingStr = localStorage.getItem("onboardingRecommendations");
      const tripsStr = localStorage.getItem("myTrips");
      const parsedTrips = tripsStr ? JSON.parse(tripsStr) : [];
      setRecentTrips(parsedTrips.slice(-3).reverse());

      if (onboardingStr) {
        const result = JSON.parse(onboardingStr);
        setPersonality(result.personality || "Custom Explorer");
        
        // Formulate a dynamic description based on preferences
        const prefsStr = localStorage.getItem("userPreferences");
        if (prefsStr) {
          const prefs = JSON.parse(prefsStr);
          setPersonalityDesc(
            `You prefer ${prefs.weather || "temperate"} weather, a ${prefs.budget || "moderate"} budget, and traveling with ${prefs.companions || "friends"}. You favor ${prefs.gems_vs_popular || "hidden gems"}.`
          );
        }

        // Map top recommendations
        if (result.top_recommendations && result.match_scores) {
          const recList = result.top_recommendations.map((rec: any, idx: number) => {
            const score = result.match_scores[rec.destination] || (95 - idx * 5);
            
            // Try to look up in database
            const dbDest = ALL_DESTINATIONS.find(
              (d) => d.name.toLowerCase().includes(rec.destination.toLowerCase()) || 
                     rec.destination.toLowerCase().includes(d.name.toLowerCase())
            );

            // Get image
            const image = dbDest ? dbDest.image : getDestImage(rec.destination);
            const category = dbDest ? dbDest.category : "Custom";
            const cost = dbDest ? dbDest.cost : "₹12,000";
            const crowd = dbDest ? dbDest.crowd : "Low";
            const weather = dbDest ? dbDest.weather : "Temperate";
            const hiddenGem = dbDest ? `${dbDest.hiddenGemScore}/10 Hidden` : "7/10 Hidden";
            const warning = crowd === "High" ? `⚠ High crowds expected at peak times` : `⚠ Keep itinerary flexible`;

            return {
              destination: rec.destination,
              match: score,
              cost: cost,
              crowd: crowd,
              weather: weather,
              time: dbDest && dbDest.category === "Mountains" ? "4h 30m" : "3h 15m",
              image: image,
              badge: category,
              hiddenGem: hiddenGem,
              warning: warning
            };
          });
          setRecommendations(recList);
        }

        // Map budget breakdown
        if (result.budgetBreakdown) {
          const parseVal = (str: string) => {
            const clean = str.replace(/[^\d]/g, "");
            return parseInt(clean) || 0;
          };
          const transportVal = parseVal(result.budgetBreakdown.transport);
          const hotelVal = parseVal(result.budgetBreakdown.hotel);
          const foodVal = parseVal(result.budgetBreakdown.food);
          const activitiesVal = parseVal(result.budgetBreakdown.activities);
          const totalVal = transportVal + hotelVal + foodVal + activitiesVal || 1;

          setBudgetBreakdown([
            { type: "Transport", cost: result.budgetBreakdown.transport, percent: Math.round((transportVal / totalVal) * 100), color: "bg-blue-600" },
            { type: "Accommodation", cost: result.budgetBreakdown.hotel, percent: Math.round((hotelVal / totalVal) * 100), color: "bg-purple-600" },
            { type: "Dining", cost: result.budgetBreakdown.food, percent: Math.round((foodVal / totalVal) * 100), color: "bg-emerald-600" },
            { type: "Activities", cost: result.budgetBreakdown.activities, percent: Math.round((activitiesVal / totalVal) * 100), color: "bg-amber-600" }
          ]);
        }

        // Map insights
        if (result.insights) {
          setAiInsights(result.insights.map((ins: string, i: number) => ({
            text: ins,
            type: i === 0 ? "location" : "crowd"
          })));
        }

        // Map comparison deals based on the primary recommended destination
        const primaryDestName = Object.keys(result.match_scores)[0] || "Srinagar";
        setCompareDestName(primaryDestName);
        
        let baseHotel = 2500;
        let baseTransit = 1200;
        if (prefsStr) {
          const prefs = JSON.parse(prefsStr);
          if (["₹15k–₹25k", "₹25k–₹50k"].includes(prefs.budget)) {
            baseHotel = 4200; baseTransit = 2600;
          } else if (prefs.budget && !["₹0–₹5k", "₹5k–₹10k", "₹10k–₹15k"].includes(prefs.budget)) {
            baseHotel = 8900; baseTransit = 7200;
          }
        }
        setBestHotelDeals([
          { platform: "MakeMyTrip", rate: `₹${(baseHotel + 220).toLocaleString()}`, isBest: false },
          { platform: "Booking.com", rate: `₹${(baseHotel - 150).toLocaleString()}`, isBest: true },
          { platform: "Goibibo", rate: `₹${(baseHotel + 80).toLocaleString()}`, isBest: false },
          { platform: "Yatra", rate: `₹${(baseHotel + 310).toLocaleString()}`, isBest: false }
        ]);
        setBestTransitDeals([
          { platform: "MakeMyTrip", rate: `₹${(baseTransit + 400).toLocaleString()}`, isBest: false },
          { platform: "RedBus", rate: `₹${(baseTransit - 120).toLocaleString()}`, isBest: true },
          { platform: "AbhiBus", rate: `₹${(baseTransit - 90).toLocaleString()}`, isBest: false },
          { platform: "ConfirmTkt", rate: `₹${(baseTransit + 180).toLocaleString()}`, isBest: false }
        ]);
      } else {
        // CURATED FALLBACK RECS
        setRecommendations([
          {
            destination: "Srinagar, Kashmir",
            match: 96,
            cost: "₹14,500",
            crowd: "Medium",
            weather: "Cold (8°C)",
            time: "4h 30m",
            image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=600&auto=format&fit=crop",
            badge: "Mountains",
            hiddenGem: "6/10 Hidden",
            warning: "⚠ High crowds expected at Dal Lake on weekends"
          },
          {
            destination: "Munnar, Kerala",
            match: 90,
            cost: "₹9,800",
            crowd: "Low",
            weather: "Temperate (19°C)",
            time: "6h 15m",
            image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600&auto=format&fit=crop",
            badge: "Forests",
            hiddenGem: "8/10 Hidden",
            warning: "⚠ Heavy evening mist decreases road visibility"
          },
          {
            destination: "Goa, India",
            match: 88,
            cost: "₹7,500",
            crowd: "High",
            weather: "Warm (30°C)",
            time: "2h 45m",
            image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop",
            badge: "Coastal",
            hiddenGem: "3/10 Hidden",
            warning: "⚠ Peak season premium prices at beach shacks"
          }
        ]);
        setBudgetBreakdown([
          { type: "Transport", cost: "₹8,500", percent: 40, color: "bg-blue-600" },
          { type: "Accommodation", cost: "₹6,000", percent: 30, color: "bg-purple-600" },
          { type: "Activities", cost: "₹4,000", percent: 20, color: "bg-emerald-600" },
          { type: "Dining", cost: "₹2,500", percent: 10, color: "bg-amber-600" }
        ]);
        setAiInsights([
          { text: "You prefer alpine destinations & cold environments.", type: "location" },
          { text: "You avoid crowded seasonal slots (prefers Low density).", type: "crowd" },
          { text: "You frequently select train transits when available.", type: "transport" }
        ]);
        setBestHotelDeals([
          { platform: "MakeMyTrip", rate: "₹4,120", isBest: false },
          { platform: "Booking.com", rate: "₹3,950", isBest: true },
          { platform: "Goibibo", rate: "₹4,080", isBest: false },
          { platform: "Yatra", rate: "₹4,200", isBest: false }
        ]);
        setBestTransitDeals([
          { platform: "MakeMyTrip (Cabs)", rate: "₹2,500", isBest: false },
          { platform: "RedBus (Buses)", rate: "₹1,200", isBest: true },
          { platform: "AbhiBus (Buses)", rate: "₹1,250", isBest: false },
          { platform: "ConfirmTkt (Trains)", rate: "₹1,400", isBest: false }
        ]);
      }
    } catch (e) {
      console.error(e);
    }

    return () => window.removeEventListener("userUpdated", handleUpdate);
  }, []);

  return (
    <div className="flex flex-col gap-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {firstName} 👋</h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">Here is what the VoyageIQ agents compiled for you today.</p>
        </div>
        <Link 
          href="/onboarding" 
          className="px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-blue-500/15"
        >
          <Plus className="w-4 h-4" /> Plan New Trip
        </Link>
      </div>

      {/* Grid Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Feed */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Travel Personality Header Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[180px]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold tracking-widest uppercase opacity-75">Travel Personality Profile</span>
              <Sparkles className="w-5 h-5 opacity-90 animate-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-black font-display tracking-tight leading-none mb-2">{personality}</h2>
              <p className="text-sm opacity-80 max-w-md leading-relaxed">
                {personalityDesc}
              </p>
            </div>
          </motion.div>

          {/* Recommended Destinations Grid */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
              <Compass className="w-5 h-5 text-blue-500" /> Matches Curated For You
            </h3>

            {recommendations && recommendations.length > 0 ? (
              <div className="grid sm:grid-cols-3 gap-4">
                {recommendations.map((dest, idx) => (
                  <div 
                    key={idx}
                    className="rounded-2xl border border-card-border bg-card overflow-hidden flex flex-col justify-between hover:border-purple-500/15 hover:scale-[1.01] transition-all group shadow-sm"
                  >
                    {/* Real Image Card header */}
                    <div className="h-28 w-full relative overflow-hidden border-b border-card-border">
                      <img 
                        src={dest.image} 
                        alt={dest.destination} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute bottom-3 left-3 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-white/95 dark:bg-black/95 text-neutral-800 dark:text-neutral-200 border border-card-border shadow-sm z-10">
                        {dest.badge}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col gap-4">
                      <div>
                        <h4 className="font-bold text-base truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {dest.destination}
                        </h4>
                        <span className="text-xs font-black text-emerald-500 mt-0.5 block">
                          {dest.match}% Match score
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 border-t border-card-border pt-3 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" /> Est: {dest.cost}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-500 shrink-0" /> Crowd: {dest.crowd}
                        </div>
                        <div className="flex items-center gap-2">
                          <CloudSun className="w-4 h-4 text-amber-500 shrink-0" /> {dest.weather}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-500 shrink-0" /> {dest.time} transit
                        </div>
                        <div className="flex flex-col gap-1 border-t border-card-border/60 pt-2 mt-1 text-[9px] font-bold">
                          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
                            <span>💎 Hidden Gem Rating:</span>
                            <span>{dest.hiddenGem}</span>
                          </div>
                          <div className="text-rose-500">
                            {dest.warning}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs font-semibold text-neutral-400 bg-card border border-card-border rounded-2xl">
                No active recommendations. Click "Plan New Trip" to get custom recommendations!
              </div>
            )}
          </div>

          {/* Live Platform Price Comparer */}
          <div className="p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-6">
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" /> Booking Platform Price Comparison
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">Compare live rates across MakeMyTrip, RedBus, AbhiBus, and Booking.com for {compareDestName}.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 border-t border-card-border/60 pt-4">
              <div className="flex flex-col gap-3">
                <span className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest block mb-1">🏨 Hotel stays (1 Night)</span>
                {bestHotelDeals.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-card-border bg-neutral-50 dark:bg-neutral-900/40 text-xs">
                    <span className="font-semibold flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                      <span className={`w-2 h-2 rounded-full ${item.isBest ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
                      {item.platform}
                      {item.isBest && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">BEST DEALS</span>}
                    </span>
                    <span className="font-black text-neutral-800 dark:text-neutral-100">{item.rate}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest block mb-1">🚄 Transit routes (Trains / Cabs / Buses)</span>
                {bestTransitDeals.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-card-border bg-neutral-50 dark:bg-neutral-900/40 text-xs">
                    <span className="font-semibold flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                      <span className={`w-2 h-2 rounded-full ${item.isBest ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
                      {item.platform}
                      {item.isBest && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">LOWEST TICKET</span>}
                    </span>
                    <span className="font-black text-neutral-800 dark:text-neutral-100">{item.rate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Widgets Sidebar */}
        <div className="flex flex-col gap-8">
          
          {/* Budget Breakdown widget */}
          <div className="p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-5">
            <h3 className="font-bold text-base">Expense Budget Breakdown</h3>
            
            {/* Visual stacked progress bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-neutral-100 dark:bg-neutral-900 border border-card-border">
              {budgetBreakdown.map((item, idx) => (
                <div key={idx} className={`${item.color} h-full`} style={{ width: `${item.percent}%` }} />
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {budgetBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-neutral-500">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    {item.type}
                  </span>
                  <span className="font-bold">{item.cost} <span className="text-[10px] text-neutral-400 font-medium">({item.percent}%)</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights Widget */}
          <div className="p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-4">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" /> AI Agent Insights
            </h3>

            <div className="flex flex-col gap-3">
              {aiInsights.map((insight, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-card-border text-xs leading-relaxed">
                  {insight.text}
                </div>
              ))}
            </div>
          </div>

          {/* Personal Travel DNA Widget */}
          <div className="p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-5 shadow-sm">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Compass className="w-4.5 h-4.5 text-purple-600 animate-pulse" /> Personal Travel DNA
            </h3>
            <div className="flex flex-col gap-3 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>⛰️ Adventure Explorer</span>
                  <span>82%</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full" style={{ width: '82%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>🌲 Nature Lover</span>
                  <span>91%</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: '91%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>🏨 Luxury seeker</span>
                  <span>22%</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: '22%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>📸 Photography Vibe</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: '75%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>💎 Hidden Gems seeker</span>
                  <span>89%</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full" style={{ width: '89%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Travel Achievement System */}
          <div className="p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-4 shadow-sm">
            <h3 className="font-bold text-base">Travel Achievements</h3>
            <div className="flex flex-wrap gap-2 text-[9px] font-black uppercase text-neutral-600 dark:text-neutral-300">
              <span className="px-2.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600">🏔 Mountain Explorer</span>
              <span className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">🌲 Nature Lover</span>
              <span className="px-2.5 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600">🚂 Train Traveller</span>
              <span className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600">💰 Budget Master</span>
            </div>
          </div>

          {/* Recent Trips widget */}
          <div className="p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-4">
            <h3 className="font-bold text-base">Recent Trips</h3>

            <div className="flex flex-col gap-3">
              {recentTrips.map((trip, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-card-border bg-neutral-50 dark:bg-neutral-900/40 text-xs">
                  <div className="flex flex-col">
                    <span className="font-bold">{trip.from} to {trip.to}</span>
                    <span className="text-[10px] text-neutral-400 mt-0.5">{trip.date}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                    {trip.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
