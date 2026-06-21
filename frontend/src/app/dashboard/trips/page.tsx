"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  Sparkles, 
  DollarSign, 
  Clock, 
  Plus, 
  Compass, 
  Train,
  Bookmark,
  Trash2,
  Users,
  CloudSun,
  ArrowRight,
  Loader2
} from "lucide-react";
import { groqAsk, parseGroqJson } from "@/lib/groq";

interface BudgetBreakdown {
  transport: string;
  hotel: string;
  food: string;
  activities: string;
  total: string;
}

interface ItineraryDay {
  day: number;
  activity: string;
  weather_snippet: string;
}

interface Trip {
  id: number;
  from: string;
  to: string;
  date: string;
  status: string;
  stops: string[];
  personality: string;
  cost: string;
  budgetBreakdown?: BudgetBreakdown;
  itinerary?: ItineraryDay[];
}

const allDestinations = [
  {
    name: "Srinagar, Kashmir",
    category: "Lakes",
    match: 96,
    cost: "₹14,500",
    crowd: "Medium",
    weather: "Cold (8°C)",
    image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=600&auto=format&fit=crop",
    desc: "Scenic shikara boat rides on Dal Lake, snow valley backdrops, and Mughal gardens."
  },
  {
    name: "Leh Ladakh, India",
    category: "Mountains",
    match: 94,
    cost: "₹24,000",
    crowd: "Low",
    weather: "Cold (5°C)",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=600&auto=format&fit=crop",
    desc: "High-altitude desert routes, stunning Pangong lake transits, and Buddhist monasteries."
  },
  {
    name: "Goa, India",
    category: "Beaches",
    match: 92,
    cost: "₹6,500",
    crowd: "High",
    weather: "Warm (30°C)",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop",
    desc: "Budget beach orientation, local shacks, and scenic coastal road drives."
  },
  {
    name: "Munnar, Kerala",
    category: "Forests",
    match: 90,
    cost: "₹9,800",
    crowd: "Low",
    weather: "Temperate (19°C)",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600&auto=format&fit=crop",
    desc: "Beautiful tea plantation walks, misty hill road routes, and waterfalls."
  },
  {
    name: "Shimla, India",
    category: "Snow",
    match: 89,
    cost: "₹7,200",
    crowd: "High",
    weather: "Cold (10°C)",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=600&auto=format&fit=crop",
    desc: "Classic colonial architecture, snowy ridge walks, and toy train mountain transits."
  },
  {
    name: "Udaipur, India",
    category: "Historic",
    match: 88,
    cost: "₹11,000",
    crowd: "Medium",
    weather: "Temperate (24°C)",
    image: "https://images.unsplash.com/photo-1595928642581-f50f4f3453a5?q=80&w=600&auto=format&fit=crop",
    desc: "Majestic Mewar lake palaces, heritage walks, and classic boat transits."
  },
  {
    name: "Manali, India",
    category: "Snow",
    match: 90,
    cost: "₹8,200",
    crowd: "High",
    weather: "Cold (12°C)",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=600&auto=format&fit=crop",
    desc: "Snow peaks, Solang Valley routes, and adventure paragliding hotspots."
  },
  {
    name: "Andaman Islands, India",
    category: "Islands",
    match: 86,
    cost: "₹16,000",
    crowd: "Low",
    weather: "Warm (27°C)",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=600&auto=format&fit=crop",
    desc: "Coral reefs, scuba diving, and pristine isolated beach walks."
  },
  {
    name: "Darjeeling, India",
    category: "Mountains",
    match: 87,
    cost: "₹9,000",
    crowd: "Medium",
    weather: "Temperate (14°C)",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop",
    desc: "Misty tea gardens, views of mount Kanchenjunga, and toy train transits."
  },
  {
    name: "Nainital, India",
    category: "Lakes",
    match: 87,
    cost: "₹8,100",
    crowd: "Medium",
    weather: "Cold (12°C)",
    image: "https://images.unsplash.com/photo-1615966650071-855b15f29ad1?q=80&w=600&auto=format&fit=crop",
    desc: "Beautiful emerald lake, yacht rides, and cable car view points."
  },
  {
    name: "Dehradun / Mussoorie, India",
    category: "Mountains",
    match: 88,
    cost: "₹9,500",
    crowd: "Medium",
    weather: "Cold (15°C)",
    image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?q=80&w=600&auto=format&fit=crop",
    desc: "Lush Doon valley overlooks, colonial Mall roads, and Kempty waterfalls."
  },
  {
    name: "Agra, India",
    category: "Historic",
    match: 85,
    cost: "₹5,200",
    crowd: "High",
    weather: "Warm (28°C)",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=600&auto=format&fit=crop",
    desc: "Home to the Taj Mahal, Agra Fort, and historic Mughal architecture."
  },
  {
    name: "Kyoto, Japan",
    category: "Historic",
    match: 80,
    cost: "₹95,000",
    crowd: "Medium",
    weather: "Temperate (16°C)",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop",
    desc: "Ancient Buddhist temples, bamboo forests, and cherry blossom shrines."
  },
  {
    name: "Chamonix, French Alps",
    category: "Mountains",
    match: 78,
    cost: "₹120,000",
    crowd: "Low",
    weather: "Cold (2°C)",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop",
    desc: "Stunning alpine skiing paths under Mont Blanc, cable cars, and glaciers."
  },
  {
    name: "Bali, Indonesia",
    category: "Islands",
    match: 83,
    cost: "₹45,000",
    crowd: "High",
    weather: "Warm (29°C)",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop",
    desc: "Volcanic mountains, iconic rice terraces, beaches, and coral reefs."
  },
  {
    name: "Sikkim, India",
    category: "Mountains",
    match: 89,
    cost: "₹12,800",
    crowd: "Low",
    weather: "Cold (11°C)",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=600&auto=format&fit=crop",
    desc: "Buddhist monasteries, pristine high-altitude lakes, and snowy passes."
  },
  {
    name: "Rome, Italy",
    category: "Historic",
    match: 75,
    cost: "₹110,000",
    crowd: "High",
    weather: "Temperate (20°C)",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=600&auto=format&fit=crop",
    desc: "Ancient Roman ruins, the Colosseum, Vatican museums, and local pasta cafes."
  },
  {
    name: "Cape Town, South Africa",
    category: "Beaches",
    match: 77,
    cost: "₹130,000",
    crowd: "Medium",
    weather: "Temperate (18°C)",
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=600&auto=format&fit=crop",
    desc: "Table Mountain vistas, cape point coastal roads, and penguin colonies."
  },
  {
    name: "Prague, Czech Republic",
    category: "Historic",
    match: 76,
    cost: "₹98,000",
    crowd: "Medium",
    weather: "Cold (9°C)",
    image: "https://images.unsplash.com/photo-1541384982283-d2f1d02e4c7d?q=80&w=600&auto=format&fit=crop",
    desc: "Historic Charles Bridge, gothic castle architectures, and old town squares."
  },
  {
    name: "Krabi, Thailand",
    category: "Islands",
    match: 84,
    cost: "₹38,000",
    crowd: "High",
    weather: "Warm (30°C)",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=600&auto=format&fit=crop",
    desc: "Limestone cliffs, emerald lagoons, boat tours, and snorkeling hotspots."
  },
  {
    name: "Lakshadweep Islands, India",
    category: "Islands",
    match: 91,
    cost: "₹28,000",
    crowd: "Low",
    weather: "Warm (28°C)",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=600&auto=format&fit=crop",
    desc: "Unspoiled white sand lagoons, coral reefs, and peaceful nature walks."
  },
  {
    name: "Gulmarg, Kashmir",
    category: "Snow",
    match: 93,
    cost: "₹18,000",
    crowd: "Medium",
    weather: "Cold (3°C)",
    image: "https://images.unsplash.com/photo-1486916856992-e4db22c8df33?q=80&w=600&auto=format&fit=crop",
    desc: "Premiere skiing resort with high cable gondola rides and snow meadows."
  },
  {
    name: "Wayanad, India",
    category: "Forests",
    match: 86,
    cost: "₹8,500",
    crowd: "Low",
    weather: "Temperate (22°C)",
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600&auto=format&fit=crop",
    desc: "Spice plantations, waterfalls, wildlife sanctuaries, and treehouse stays."
  },
  {
    name: "Ooty, India",
    category: "Mountains",
    match: 88,
    cost: "₹7,800",
    crowd: "High",
    weather: "Temperate (15°C)",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600&auto=format&fit=crop",
    desc: "Misty botanical gardens, tea plantations, and heritage toy train rides."
  },
  {
    name: "Gokarna, India",
    category: "Beaches",
    match: 89,
    cost: "₹5,800",
    crowd: "Medium",
    weather: "Warm (28°C)",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
    desc: "Offbeat beach treks (Om beach, Half Moon beach) and laid-back shacks."
  },
  {
    name: "Varkala, India",
    category: "Beaches",
    match: 90,
    cost: "₹7,900",
    crowd: "Medium",
    weather: "Warm (29°C)",
    image: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=600&auto=format&fit=crop",
    desc: "Stunning red clay cliffs overlooking the Arabian Sea, yoga retreats, and surf."
  },
  {
    name: "Rishikesh, India",
    category: "Lakes",
    match: 91,
    cost: "₹5,500",
    crowd: "High",
    weather: "Temperate (20°C)",
    image: "https://images.unsplash.com/photo-1618083707368-b3823daa2726?q=80&w=600&auto=format&fit=crop",
    desc: "Ganges river rafting, suspension bridges, yoga ashrams, and mountain trekking."
  },
  {
    name: "Coorg, India",
    category: "Forests",
    match: 87,
    cost: "₹9,200",
    crowd: "Medium",
    weather: "Temperate (18°C)",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600&auto=format&fit=crop",
    desc: "Coffee plantations, spice estates, Abbe waterfalls, and elephant camps."
  }
];

export default function MyTripsAndSaves() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [savedNames, setSavedNames] = useState<string[]>([]);
  const [expandedTripId, setExpandedTripId] = useState<number | null>(null);

  // Upgrade state tracker for "If I Had X More" feature
  const [upgradeTiers, setUpgradeTiers] = useState<Record<number, number>>({});

  const toggleUpgradeTier = (tripId: number, amt: number) => {
    setUpgradeTiers(prev => ({
      ...prev,
      [tripId]: prev[tripId] === amt ? 0 : amt
    }));
  };

  // AI-generated per-trip data (cached by trip ID)
  const [tripNames, setTripNames] = useState<Record<number, string>>({});
  const [tripSecrets, setTripSecrets] = useState<Record<number, string[]>>({});
  const [tripUpgrades, setTripUpgrades] = useState<Record<string, string>>({});
  const [loadingNames, setLoadingNames] = useState<Record<number, boolean>>({});
  const [loadingSecrets, setLoadingSecrets] = useState<Record<number, boolean>>({});
  const [loadingUpgrade, setLoadingUpgrade] = useState<Record<string, boolean>>({});

  const getAiTripName = async (trip: Trip) => {
    if (tripNames[trip.id]) return;
    setLoadingNames(prev => ({ ...prev, [trip.id]: true }));
    try {
      const name = await groqAsk(
        `Create a creative, evocative 4-6 word travel trip name for a journey from ${trip.from} to ${trip.to}. Return ONLY the trip name, no punctuation, no quotes.`,
        "You are a travel copywriter. Create poetic, memorable trip names.",
        { temperature: 0.9, maxTokens: 30 }
      );
      setTripNames(prev => ({ ...prev, [trip.id]: name.trim() }));
    } catch {
      setTripNames(prev => ({ ...prev, [trip.id]: `The ${trip.to.split(",")[0]} Journey` }));
    } finally {
      setLoadingNames(prev => ({ ...prev, [trip.id]: false }));
    }
  };

  const getLocalSecrets = async (trip: Trip) => {
    if (tripSecrets[trip.id]) return;
    setLoadingSecrets(prev => ({ ...prev, [trip.id]: true }));
    try {
      const raw = await groqAsk(
        `Give 4 hyper-local secrets for visiting ${trip.to}. Format as JSON array of objects with keys "label" (e.g. "Hidden Cafe") and "tip" (short specific tip, max 6 words). Example: [{"label": "Hidden Cafe", "tip": "rooftop chai with valley view"}]`,
        "You are a local Indian travel expert. Give specific, genuine local tips.",
        { temperature: 0.7, maxTokens: 200, jsonMode: true }
      );
      const parsed = parseGroqJson<{label: string; tip: string}[]>(raw);
      const secrets = Array.isArray(parsed)
        ? parsed.map(s => `${s.label}: ${s.tip}`)
        : [`Visit at dawn for best photos`, `Try local street food`, `Avoid peak tourist hours`, `Ask locals for hidden trails`];
      setTripSecrets(prev => ({ ...prev, [trip.id]: secrets }));
    } catch {
      setTripSecrets(prev => ({ ...prev, [trip.id]: [`Dawn gives best light`, `Try street food`, `Go on weekday mornings`, `Ask guesthouse for local tips`] }));
    } finally {
      setLoadingSecrets(prev => ({ ...prev, [trip.id]: false }));
    }
  };

  const getUpgradeSuggestion = async (trip: Trip, amount: number) => {
    const key = `${trip.id}-${amount}`;
    if (tripUpgrades[key]) return;
    setLoadingUpgrade(prev => ({ ...prev, [key]: true }));
    try {
      const text = await groqAsk(
        `For a trip to ${trip.to} with total budget ${trip.cost}, what specific upgrades does adding ₹${amount.toLocaleString("en-IN")} unlock? Give 2-3 concrete upgrade suggestions (hotel upgrade, transit upgrade, activity). Use bullet points, be specific to ${trip.to.split(",")[0]}.`,
        "You are a VoyageIQ travel upgrade advisor. Give practical, destination-specific upgrade advice.",
        { temperature: 0.7, maxTokens: 200 }
      );
      setTripUpgrades(prev => ({ ...prev, [key]: text }));
    } catch {
      setTripUpgrades(prev => ({ ...prev, [key]: `• Hotel: Upgrade to boutique scenic property\n• Transit: Add private cab for transfers\n• Activity: Book a premium guided experience` }));
    } finally {
      setLoadingUpgrade(prev => ({ ...prev, [key]: false }));
    }
  };

  useEffect(() => {
    // Load planned trips
    const tripsList = localStorage.getItem("myTrips");
    if (tripsList) {
      try {
        setTrips(JSON.parse(tripsList));
      } catch (e) {
        console.error("Failed to parse trips", e);
      }
    }

    // Load bookmarked destinations
    const bookmarks = localStorage.getItem("savedDestinations");
    if (bookmarks) {
      try {
        setSavedNames(JSON.parse(bookmarks));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedTripId(prev => (prev === id ? null : id));
  };

  const handleClearTrips = () => {
    localStorage.removeItem("myTrips");
    setTrips([]);
  };

  const removeBookmark = (name: string) => {
    const updated = savedNames.filter(item => item !== name);
    setSavedNames(updated);
    localStorage.setItem("savedDestinations", JSON.stringify(updated));
  };

  const bookmarkedDestinations = allDestinations.filter(dest => savedNames.includes(dest.name));

  return (
    <div className="flex flex-col gap-10 animate-fade-in pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My Trips & Saves</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Access your planned itineraries, route segments, and bookmarked destinations in one consolidated space.
          </p>
        </div>
      </div>

      {/* SECTION 1: Planned Trips */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">Planned Itineraries</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold text-xs">
              {trips.length}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {trips.length > 0 && (
              <button 
                onClick={handleClearTrips}
                className="px-4 py-2.5 rounded-xl border border-card-border bg-card text-xs font-bold text-rose-500 hover:bg-rose-500/5 transition-colors cursor-pointer"
              >
                Clear All Trips
              </button>
            )}
            <Link 
              href="/onboarding"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors flex items-center gap-1.5 shadow-md shadow-purple-500/10"
            >
              <Plus className="w-4 h-4" /> Plan Trip
            </Link>
          </div>
        </div>

        {trips.length > 0 ? (
          <div className="flex flex-col gap-6">
            {trips.map((trip) => {
              const isExpanded = expandedTripId === trip.id;
              return (
                <div 
                  key={trip.id}
                  className={`rounded-3xl border border-card-border bg-card overflow-hidden transition-all duration-300 shadow-sm ${
                    isExpanded ? "ring-1 ring-purple-500/15" : "hover:border-purple-500/10"
                  }`}
                >
                  {/* Header Summary */}
                  <div 
                    onClick={() => { toggleExpand(trip.id); if (!expandedTripId) { getAiTripName(trip); } }}
                    className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer select-none hover:bg-neutral-50/20 dark:hover:bg-neutral-900/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/5 text-purple-600 border border-purple-500/10 flex items-center justify-center shrink-0">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-3">
                          <h3 className="font-extrabold text-base">{trip.from} to {trip.to}</h3>
                          <span className="text-[9px] font-black text-purple-600 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            {loadingNames[trip.id] ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : null}
                            {tripNames[trip.id] || (loadingNames[trip.id] ? "AI naming..." : "✨ AI Name")}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg border ${
                            trip.status === "Upcoming" 
                              ? "bg-purple-500/5 text-purple-600 border-purple-500/10" 
                              : "bg-emerald-500/5 text-emerald-600 border-emerald-500/10"
                          }`}>
                            {trip.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-500">
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {trip.date}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {trip.stops.length} Stops</span>
                          <span>Style: {trip.personality}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-card-border/60 pt-4 md:pt-0">
                      <div className="flex flex-col text-left md:text-right">
                        <span className="text-[10px] font-extrabold uppercase text-neutral-400">Total Budget</span>
                        <span className="text-lg font-black text-emerald-500">{trip.cost}</span>
                      </div>
                      <button className="p-3 rounded-xl border border-card-border bg-card text-neutral-500 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors flex items-center justify-center">
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details Pane */}
                  {isExpanded && (
                    <div className="border-t border-card-border bg-neutral-50/20 dark:bg-neutral-900/10 p-6 flex flex-col gap-6 animate-slide-up">
                      
                      {/* Budget Estimation Explanation Box */}
                      {trip.budgetBreakdown && (
                        <div className="p-6 rounded-2xl bg-card border border-card-border flex flex-col gap-5">
                          <div>
                            <h4 className="font-extrabold text-sm flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-emerald-500" /> How is this budget estimated?
                            </h4>
                            <p className="text-xs text-neutral-500 mt-1">
                              VoyageIQ's Budget Agent estimated your expenses across four itemized travel segments:
                            </p>
                          </div>

                          {/* Cost Itemization grid */}
                          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 rounded-xl border border-card-border bg-neutral-50 dark:bg-neutral-900/50 text-center flex flex-col gap-1">
                              <span className="text-[10px] font-extrabold text-neutral-400 uppercase">Transit Costs</span>
                              <span className="text-base font-black text-neutral-800 dark:text-neutral-100">{trip.budgetBreakdown.transport}</span>
                              <span className="text-[9px] text-neutral-500">Train/Flight fare estimates</span>
                            </div>
                            <div className="p-4 rounded-xl border border-card-border bg-neutral-50 dark:bg-neutral-900/50 text-center flex flex-col gap-1">
                              <span className="text-[10px] font-extrabold text-neutral-400 uppercase">🏨 Hotel & Stay</span>
                              <span className="text-base font-black text-neutral-800 dark:text-neutral-100">{trip.budgetBreakdown.hotel}</span>
                              <span className="text-[9px] text-neutral-500">Booking.com standard rate</span>
                            </div>
                            <div className="p-4 rounded-xl border border-card-border bg-neutral-50 dark:bg-neutral-900/50 text-center flex flex-col gap-1">
                              <span className="text-[10px] font-extrabold text-neutral-400 uppercase">🍲 Food Allowance</span>
                              <span className="text-base font-black text-neutral-800 dark:text-neutral-100">{trip.budgetBreakdown.food}</span>
                              <span className="text-[9px] text-neutral-500">Local dining allocations</span>
                            </div>
                            <div className="p-4 rounded-xl border border-card-border bg-neutral-50 dark:bg-neutral-900/50 text-center flex flex-col gap-1">
                              <span className="text-[10px] font-extrabold text-neutral-400 uppercase">🎫 Activities & Entry</span>
                              <span className="text-base font-black text-neutral-800 dark:text-neutral-100">{trip.budgetBreakdown.activities}</span>
                              <span className="text-[9px] text-neutral-500">Sightseeing & permit index</span>
                            </div>
                          </div>

                          {/* Budget Logic Explanation text */}
                          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                            <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 mb-1.5">
                              <Sparkles className="w-3.5 h-3.5" /> VoyageIQ AI Estimation Details:
                            </span>
                            We queried rates matching your budget tier constraints. For stay calculations, our model uses real rates averaging between Booking.com and MakeMyTrip. Transit fares represent estimated travel segments from your starting city to {trip.to}.
                          </div>
                        </div>
                      )}

                      {/* Premium Travel Risk Score & AI Regret Score Drawer */}
                      <div className="grid sm:grid-cols-2 gap-6">
                        {/* Travel Risk Indicator */}
                        <div className="p-5 rounded-2xl bg-card border border-card-border flex flex-col gap-3">
                          <h4 className="font-extrabold text-xs text-neutral-400 uppercase tracking-wider">🔒 AI Travel Risk Analysis</h4>
                          <div className="flex flex-col gap-2 text-xs">
                            <div className="flex justify-between items-center">
                              <span>Weather Risk:</span>
                              <span className="text-emerald-500 font-bold">Low (Safe Forecast)</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Safety Index:</span>
                              <span className="text-emerald-500 font-bold">Safe (High rating)</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Transit Reliability:</span>
                              <span className="text-amber-500 font-bold">Medium (Potential delays)</span>
                            </div>
                            <div className="border-t border-card-border/60 pt-2 flex justify-between items-center font-bold">
                              <span>Overall Risk Score:</span>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">LOW RISK</span>
                            </div>
                          </div>
                        </div>

                        {/* AI Regret Prediction */}
                        <div className="p-5 rounded-2xl bg-card border border-card-border flex flex-col gap-3">
                          <h4 className="font-extrabold text-xs text-rose-500 uppercase tracking-wider">🎯 AI Regret Score Predictor</h4>
                          <p className="text-[10px] text-neutral-400">VoyageIQ predicts your post-trip regrets if you finalize this plan:</p>
                          <div className="flex flex-col gap-2 text-xs">
                            <div className="flex justify-between items-center">
                              <span>Crowd Regret:</span>
                              <span className="text-emerald-500 font-bold">Low (Avoids rushes)</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Budget Regret:</span>
                              <span className="text-amber-500 font-bold">Medium (Typical margins)</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Weather Regret:</span>
                              <span className="text-emerald-500 font-bold">Low (Perfect season)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* "If I Had ₹X More" Upgrader */}
                      <div className="p-6 rounded-2xl bg-card border border-card-border flex flex-col gap-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-neutral-400">💡 "If I Had ₹X More" Upgrader</h4>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => { toggleUpgradeTier(trip.id, 5000); getUpgradeSuggestion(trip, 5000); }}
                              className={`px-3 py-1.5 rounded-lg text-[9px] font-black border cursor-pointer ${
                                upgradeTiers[trip.id] === 5000 
                                  ? "bg-purple-600 text-white border-purple-600" 
                                  : "bg-background border-card-border text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                              }`}
                            >
                              +₹5,000
                            </button>
                            <button 
                              onClick={() => { toggleUpgradeTier(trip.id, 10000); getUpgradeSuggestion(trip, 10000); }}
                              className={`px-3 py-1.5 rounded-lg text-[9px] font-black border cursor-pointer ${
                                upgradeTiers[trip.id] === 10000 
                                  ? "bg-purple-600 text-white border-purple-600" 
                                  : "bg-background border-card-border text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                              }`}
                            >
                              +₹10,000
                            </button>
                          </div>
                        </div>

                        {upgradeTiers[trip.id] && (() => {
                          const key = `${trip.id}-${upgradeTiers[trip.id]}`;
                          const upgradeText = tripUpgrades[key];
                          const isLoadingUpg = loadingUpgrade[key];
                          return (
                            <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/10 text-xs flex flex-col gap-1.5 animate-slide-up">
                              <span className="font-black text-purple-600 dark:text-purple-400">
                                {upgradeTiers[trip.id] === 5000 ? "✨ With ₹5,000 More:" : "👑 With ₹10,000 More:"}
                              </span>
                              {isLoadingUpg ? (
                                <span className="flex items-center gap-1.5 text-neutral-400"><Loader2 className="w-3 h-3 animate-spin" /> AI calculating upgrades...</span>
                              ) : (
                                <span className="text-neutral-600 dark:text-neutral-300 whitespace-pre-line">{upgradeText || "Loading AI suggestions..."}</span>
                              )}
                            </div>
                          );
                        })()}
                        {!upgradeTiers[trip.id] && (
                          <p className="text-[10px] text-neutral-400">Select a tier above for AI-powered destination-specific upgrade suggestions.</p>
                        )}
                      </div>

                      {/* Local Secret Recommendations - Groq AI powered */}
                      <div className="p-5 rounded-2xl bg-card border border-card-border flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wider">🗺️ VoyageIQ Local Secrets</h4>
                          {!tripSecrets[trip.id] && !loadingSecrets[trip.id] && (
                            <button
                              onClick={() => getLocalSecrets(trip)}
                              className="text-[9px] font-black text-purple-600 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg hover:bg-purple-500/20 transition-colors cursor-pointer"
                            >
                              ✨ Generate AI Secrets
                            </button>
                          )}
                        </div>
                        {loadingSecrets[trip.id] && (
                          <div className="flex items-center gap-2 text-xs text-neutral-400">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> AI finding local secrets for {trip.to.split(",")[0]}...
                          </div>
                        )}
                        {tripSecrets[trip.id] && (
                          <div className="grid sm:grid-cols-2 gap-3">
                            {tripSecrets[trip.id].map((secret, sIdx) => {
                              const [label, ...rest] = secret.split(":");
                              return (
                                <div key={sIdx} className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-card-border flex flex-col gap-0.5 text-xs font-semibold">
                                  <span className="text-[8px] font-black uppercase text-neutral-400">{label}</span>
                                  <span>{rest.join(":").trim()}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {!tripSecrets[trip.id] && !loadingSecrets[trip.id] && (
                          <p className="text-[10px] text-neutral-400">Click "Generate AI Secrets" for hyper-local insider tips powered by Groq AI.</p>
                        )}
                      </div>

                      {/* Day by Day route outline */}
                      {trip.itinerary && (
                        <div className="flex flex-col gap-4">
                          <h4 className="font-extrabold text-sm flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                            <Calendar className="w-4.5 h-4.5 text-amber-500" /> Planned Itinerary Route
                          </h4>
                          <div className="flex flex-col gap-3">
                            {trip.itinerary.map((day: any) => (
                              <div 
                                key={day.day} 
                                className="p-4 rounded-2xl bg-card border border-card-border flex justify-between items-start gap-4"
                              >
                                <div className="flex items-start gap-3">
                                  <span className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold text-xs shrink-0">
                                    Day {day.day}
                                  </span>
                                  <p className="text-xs font-semibold leading-relaxed mt-0.5">{day.activity}</p>
                                </div>
                                <span className="text-[10px] font-bold text-neutral-400 shrink-0 uppercase tracking-wider bg-neutral-100 dark:bg-neutral-900 border border-card-border px-2 py-0.5 rounded-md">
                                  Forecast: {day.weather_snippet}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Trips state */
          <div className="flex flex-col items-center justify-center text-center py-16 bg-card border border-card-border rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[50%] glow-purple opacity-20 pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[50%] glow-blue opacity-20 pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-purple-500/5 text-purple-600 border border-purple-500/10 flex items-center justify-center mb-6 shrink-0 shadow-inner">
              <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            
            <h2 className="text-xl font-black tracking-tight mb-2">No planned trips yet</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed mb-8">
              Create your first travel itinerary using our onboarding questionnaire. VoyageIQ will construct a customized travel graph with platform price estimates.
            </p>

            <Link 
              href="/onboarding"
              className="px-6 py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-blue-500/10 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Start Planning First Trip
            </Link>
          </div>
        )}
      </div>

      <div className="h-px bg-card-border my-4" />

      {/* SECTION 2: Bookmarked Spots */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight">Bookmarked Destinations</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold text-xs">
            {bookmarkedDestinations.length}
          </span>
        </div>

        {bookmarkedDestinations.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedDestinations.map((dest, idx) => (
              <div 
                key={idx}
                className="rounded-3xl border border-card-border bg-card overflow-hidden flex flex-col justify-between hover:scale-[1.01] hover:border-purple-500/15 transition-all duration-300 group shadow-sm"
              >
                {/* Photo header */}
                <div className="h-44 w-full relative overflow-hidden">
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Match percentage badge */}
                  <span className="absolute top-4 left-4 text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-md">
                    {dest.match}% MATCH
                  </span>

                  {/* Remove bookmark Button */}
                  <button 
                    onClick={() => removeBookmark(dest.name)}
                    className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/95 dark:bg-black/95 border border-card-border text-rose-500 hover:bg-rose-50 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                      {dest.desc}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5 border-t border-card-border pt-4 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-emerald-500" /> Est. Cost</span>
                      <span className="font-black text-neutral-800 dark:text-neutral-100">{dest.cost}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-500" /> Crowd Index</span>
                      <span className="font-bold">{dest.crowd}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><CloudSun className="w-4 h-4 text-amber-500" /> Weather Vibe</span>
                      <span className="font-bold">{dest.weather}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Bookmarks state */
          <div className="flex flex-col items-center justify-center text-center py-16 bg-card border border-card-border rounded-3xl p-8 max-w-lg mx-auto w-full">
            <Bookmark className="w-12 h-12 text-neutral-300 mb-4" />
            <h3 className="font-extrabold text-lg">No saved destinations</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs leading-relaxed">
              You haven't bookmarked any spots yet. Explore recommendations and bookmark your favorites.
            </p>
            <Link 
              href="/dashboard/discover"
              className="mt-6 px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-blue-500/10 cursor-pointer"
            >
              Browse Discover Feed <ArrowRight className="w-4.5 h-4.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
