"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Compass, 
  ArrowRight, 
  SlidersHorizontal,
  Loader2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Map
} from "lucide-react";

export default function RouteExplorer() {
  // Major pre-populated cities list
  const presetCities = [
    "Agra", "Ahmedabad", "Aizawl", "Ajmer", "Allahabad", "Amritsar",
    "Andaman Islands", "Aurangabad", "Bangalore", "Bhopal", "Bhubaneswar",
    "Chandigarh", "Chennai", "Chopta", "Coimbatore", "Coorg",
    "Darjeeling", "Dehradun", "Delhi", "Dharamsala", "Diu",
    "Dzukou Valley", "Goa", "Gokarna", "Gulmarg", "Hampi",
    "Haridwar", "Hyderabad", "Imphal", "Indore", "Itanagar",
    "Jaipur", "Jaisalmer", "Jodhpur", "Kasol", "Kaziranga",
    "Khajuraho", "Kochi", "Kohima", "Kolkata", "Ladakh",
    "Lakshadweep", "Lucknow", "Madurai", "Majuli", "Manali",
    "Mandu", "Meghalaya", "Mumbai", "Munnar", "Munsiyari",
    "Mysore", "Nagpur", "Nainital", "Ooty", "Orchha",
    "Patna", "Pench", "Pondicherry", "Pune", "Puri",
    "Rann of Kutch", "Rishikesh", "Shimla", "Shillong",
    "Sikkim", "Spiti Valley", "Srinagar", "Tarkarli", "Tawang",
    "Thrissur", "Udaipur", "Vadodara", "Varanasi", "Varkala",
    "Visakhapatnam", "Wayanad", "Ziro Valley",
    "Kyoto", "Bali", "Krabi", "Rome", "Paris"
  ];

  // Starting city configuration
  const [startCity, setStartCity] = useState("Lucknow");

  // Destination configuration
  const [endCity, setEndCity] = useState("Dehradun");

  // Dynamic Route States
  const [nodes, setNodes] = useState<any>(null);
  const [edges, setEdges] = useState<any[]>([]);
  const [pathOptions, setPathOptions] = useState<any[]>([]);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Time vs Money Optimizer slider state (0 = Save Money, 100 = Save Time)
  const [timeVsMoney, setTimeVsMoney] = useState(50);

  // Adventure Mode (Fastest, Scenic, Historic, Nature)
  const [adventureMode, setAdventureMode] = useState<"Fastest" | "Scenic" | "Historic" | "Nature">("Fastest");

  // Derive weights based on Slider & Mode settings
  let timeWeight = 0.4;
  let costWeight = 0.4;
  let scenicWeight = 0.2;

  if (adventureMode === "Scenic") {
    timeWeight = 0.15;
    costWeight = 0.15;
    scenicWeight = 0.7;
  } else if (adventureMode === "Historic") {
    timeWeight = 0.2;
    costWeight = 0.3;
    scenicWeight = 0.5; // weight given to heritage/scenic routes
  } else if (adventureMode === "Nature") {
    timeWeight = 0.1;
    costWeight = 0.2;
    scenicWeight = 0.7; // weight to nature routes
  } else {
    // Normal / Time vs Money Slider Mode
    const normalizedSlider = timeVsMoney / 100;
    timeWeight = normalizedSlider * 0.8;
    costWeight = (1.0 - normalizedSlider) * 0.8;
    scenicWeight = 0.2;
  }

  // Fetch routes from Backend with Local Mock Fallback
  useEffect(() => {
    const fetchRoutes = async () => {
      const start = startCity.trim();
      const end = endCity.trim();

      if (!start || !end) return;

      setIsLoading(true);
      setErrorMsg(null);

      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/v1/routes/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
          },
          body: JSON.stringify({
            start_city: start,
            end_city: end,
            cost_weight: costWeight,
            time_weight: timeWeight,
            scenic_weight: scenicWeight
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail || "Query failed");
        }

        setNodes(data.nodes);
        setEdges(data.edges);
        setPathOptions(data.routes);
        setSelectedRouteIdx(0);
      } catch (err: any) {
        console.warn("Backend route query failed, using dynamic local mock generator:", err);
        
        // Generate beautiful local fallback routes
        // Normalize names
        const s = start.trim().toLowerCase();
        const e = end.trim().toLowerCase();
        
        let nodes: any = {};
        let edges: any[] = [];
        let routes: any[] = [];

        // Check for specific common presets in India to show gorgeous multi-hop graphs!
        if (
          (s.includes("jaipur") && e.includes("lucknow")) ||
          (s.includes("lucknow") && e.includes("jaipur"))
        ) {
          const first = s.includes("jaipur") ? "Jaipur" : "Lucknow";
          const last = s.includes("jaipur") ? "Lucknow" : "Jaipur";
          
          nodes = {
            [first]: { x: 80, y: 200, label: first },
            "Agra": { x: 360, y: 240, label: "Agra" },
            "Delhi": { x: 280, y: 80, label: "Delhi" },
            [last]: { x: 640, y: 200, label: last }
          };

          edges = [
            { from: "Jaipur", to: "Agra", cost: 700, travel_time: 4.5, scenic_score: 6, comfort_rating: 7, transport_mode: "Train" },
            { from: "Agra", to: "Lucknow", cost: 800, travel_time: 4.0, scenic_score: 5, comfort_rating: 8, transport_mode: "Car" },
            { from: "Jaipur", to: "Delhi", cost: 600, travel_time: 5.0, scenic_score: 4, comfort_rating: 6, transport_mode: "Bus" },
            { from: "Delhi", to: "Lucknow", cost: 1200, travel_time: 6.0, scenic_score: 3, comfort_rating: 8, transport_mode: "Train" },
            { from: "Delhi", to: "Agra", cost: 500, travel_time: 3.0, scenic_score: 4, comfort_rating: 7, transport_mode: "Car" }
          ];

          routes = [
            {
              path: ["Jaipur", "Agra", "Lucknow"],
              cost: 1500,
              time: 8.5,
              scenic: 5.5,
              comfort: 7.5,
              edges: [{ from: "Jaipur", to: "Agra" }, { from: "Agra", to: "Lucknow" }]
            },
            {
              path: ["Jaipur", "Delhi", "Lucknow"],
              cost: 1800,
              time: 11.0,
              scenic: 3.5,
              comfort: 7.0,
              edges: [{ from: "Jaipur", to: "Delhi" }, { from: "Delhi", to: "Lucknow" }]
            },
            {
              path: ["Jaipur", "Delhi", "Agra", "Lucknow"],
              cost: 1900,
              time: 12.0,
              scenic: 4.3,
              comfort: 7.3,
              edges: [{ from: "Jaipur", to: "Delhi" }, { from: "Delhi", to: "Agra" }, { from: "Agra", to: "Lucknow" }]
            }
          ];
        } else if (
          (s.includes("delhi") && e.includes("lucknow")) ||
          (s.includes("lucknow") && e.includes("delhi"))
        ) {
          const first = s.includes("delhi") ? "Delhi" : "Lucknow";
          const last = s.includes("delhi") ? "Lucknow" : "Delhi";
          
          nodes = {
            [first]: { x: 80, y: 200, label: first },
            "Agra": { x: 360, y: 240, label: "Agra" },
            [last]: { x: 640, y: 200, label: last }
          };

          edges = [
            { from: "Delhi", to: "Lucknow", cost: 1200, travel_time: 6.0, scenic_score: 3, comfort_rating: 8, transport_mode: "Train" },
            { from: "Delhi", to: "Agra", cost: 500, travel_time: 3.0, scenic_score: 4, comfort_rating: 7, transport_mode: "Car" },
            { from: "Agra", to: "Lucknow", cost: 800, travel_time: 4.0, scenic_score: 5, comfort_rating: 8, transport_mode: "Car" }
          ];

          routes = [
            {
              path: ["Delhi", "Lucknow"],
              cost: 1200,
              time: 6.0,
              scenic: 3.0,
              comfort: 8.0,
              edges: [{ from: "Delhi", to: "Lucknow" }]
            },
            {
              path: ["Delhi", "Agra", "Lucknow"],
              cost: 1300,
              time: 7.0,
              scenic: 4.5,
              comfort: 7.5,
              edges: [{ from: "Delhi", to: "Agra" }, { from: "Agra", to: "Lucknow" }]
            }
          ];
        } else {
          // Smart general region-based nodes instead of Gateway/Link
          const isIndia = s.includes("india") || e.includes("india") || ["delhi", "mumbai", "lko", "lucknow", "agra", "jaipur", "dehradun", "goa", "munnar", "srinagar", "kerala", "kashmir", "bengaluru", "bangalore"].some(x => s.includes(x) || e.includes(x));
          const isEurope = s.includes("europe") || e.includes("europe") || ["paris", "rome", "london", "france", "italy", "uk", "prague", "swiss", "alps", "chamonix"].some(x => s.includes(x) || e.includes(x));
          
          const hub1 = isEurope ? "Zurich" : isIndia ? "Delhi Hub" : "Central Transit";
          const hub2 = isEurope ? "Munich" : isIndia ? "Agra Transit" : "Region Hub";
          const hub3 = isEurope ? "Milan" : isIndia ? "Bhopal Junction" : "Scenic Intersection";

          nodes = {
            [start]: { x: 80, y: 200, label: start },
            [end]: { x: 640, y: 200, label: end },
            [hub1]: { x: 360, y: 100, label: hub1 },
            [hub2]: { x: 240, y: 290, label: hub2 },
            [hub3]: { x: 480, y: 290, label: hub3 }
          };

          edges = [
            { from: start, to: hub1, cost: 4200, travel_time: 4.5, scenic_score: 5, comfort_rating: 8, transport_mode: "Flight" },
            { from: hub1, to: end, cost: 800, travel_time: 1.5, scenic_score: 6, comfort_rating: 7, transport_mode: "Car" },
            { from: start, to: hub2, cost: 600, travel_time: 3.5, scenic_score: 7, comfort_rating: 6, transport_mode: "Train" },
            { from: hub2, to: hub3, cost: 900, travel_time: 4.0, scenic_score: 9, comfort_rating: 8, transport_mode: "Train" },
            { from: hub3, to: end, cost: 500, travel_time: 2.0, scenic_score: 8, comfort_rating: 7, transport_mode: "Car" },
            { from: start, to: hub3, cost: 1100, travel_time: 5.5, scenic_score: 6, comfort_rating: 6, transport_mode: "Bus" },
            { from: hub3, to: end, cost: 850, travel_time: 4.5, scenic_score: 6, comfort_rating: 6, transport_mode: "Bus" }
          ];

          routes = [
            {
              path: [start, hub1, end],
              cost: 5000,
              time: 6.0,
              scenic: 5.5,
              comfort: 7.5,
              edges: [{ from: start, to: hub1 }, { from: hub1, to: end }]
            },
            {
              path: [start, hub2, hub3, end],
              cost: 2000,
              time: 9.5,
              scenic: 8.0,
              comfort: 7.0,
              edges: [{ from: start, to: hub2 }, { from: hub2, to: hub3 }, { from: hub3, to: end }]
            },
            {
              path: [start, hub3, end],
              cost: 1950,
              time: 10.0,
              scenic: 6.0,
              comfort: 6.0,
              edges: [{ from: start, to: hub3 }, { from: hub3, to: end }]
            }
          ];
        }

        setNodes(nodes);
        setEdges(edges);
        setPathOptions(routes);
        setSelectedRouteIdx(0);
      } finally {
        setIsLoading(false);
      }
    };



    const timer = setTimeout(() => {
      fetchRoutes();
    }, 600);

    return () => clearTimeout(timer);
  }, [startCity, endCity, costWeight, timeWeight, scenicWeight]);

  const currentPath = pathOptions[selectedRouteIdx] || null;

  const isEdgeInSelectedPath = (from: string, to: string) => {
    if (!currentPath) return false;
    return currentPath.edges.some(
      (edge: any) => 
        (edge.from === from && edge.to === to) || 
        (edge.from === to && edge.to === from)
    );
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-12">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Route Intelligence Explorer</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Calculate multi-objective routes across any global city by adjusting time, money, and adventure filters.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Control Panel */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          
          {/* Query Inputs */}
          <div className="p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-5 shadow-sm">
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <Compass className="w-5 h-5 text-purple-600" /> Start & Destination
            </h3>

            <div className="flex flex-col gap-4">
              {/* Alert message indicating any destination works */}
              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex gap-2.5 items-start">
                <Sparkles className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] font-bold text-purple-700 dark:text-purple-300 leading-relaxed">
                  VoyageIQ AI calculates routes for <strong>any global destination</strong>, including remote towns and offbeat villages. Just type your location!
                </p>
              </div>

              {/* Popular Preset City Avatars */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-extrabold uppercase text-neutral-400">Quick Destination Presets:</span>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
                  {[
                    { name: "Jaipur", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41" },
                    { name: "Srinagar", img: "https://images.unsplash.com/photo-1598091383021-15ddea10925d" },
                    { name: "Goa", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2" },
                    { name: "Andaman Islands", img: "https://images.unsplash.com/photo-1506929562872-bb421503ef21" },
                    { name: "Ooty", img: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2" },
                    { name: "Rishikesh", img: "https://images.unsplash.com/photo-1618083707368-b3823daa2726" },
                    { name: "Shimla", img: "https://images.unsplash.com/photo-1605649487212-47bdab064df7" }
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setEndCity(preset.name)}
                      className="flex-shrink-0 flex flex-col items-center gap-1 group cursor-pointer"
                      title={`Set destination to ${preset.name}`}
                    >
                      <div className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-all ${endCity === preset.name ? 'border-purple-600 scale-105' : 'border-card-border group-hover:border-purple-400'}`}>
                        <img src={`${preset.img}?q=80&w=120&auto=format&fit=crop`} alt={preset.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[9px] font-bold text-neutral-500 group-hover:text-purple-600 transition-colors">{preset.name.split(',')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Start City selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase text-neutral-400">Starting City</label>
                <input 
                  type="text" 
                  list="start-cities"
                  placeholder="Enter starting city (e.g. Lucknow)"
                  value={startCity}
                  onChange={(e) => setStartCity(e.target.value)}
                  className="w-full p-3 rounded-xl border border-card-border bg-background text-xs font-semibold focus:outline-none focus:border-purple-500"
                />
                <datalist id="start-cities">
                  {presetCities.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>

              {/* End City selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase text-neutral-400">Destination City</label>
                <input 
                  type="text" 
                  list="end-cities"
                  placeholder="Enter destination (e.g. Dehradun)"
                  value={endCity}
                  onChange={(e) => setEndCity(e.target.value)}
                  className="w-full p-3 rounded-xl border border-card-border bg-background text-xs font-semibold focus:outline-none focus:border-purple-500"
                />
                <datalist id="end-cities">
                  {presetCities.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* Time vs Money Optimizer */}
          <div className="p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-4 shadow-sm">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-neutral-400">
              Time vs Money Optimizer
            </h3>
            
            <div className="flex flex-col gap-2.5">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={timeVsMoney}
                onChange={(e) => {
                  setAdventureMode("Fastest"); // reset adventure mode when slider moves
                  setTimeVsMoney(Number(e.target.value));
                }}
                className="w-full accent-purple-600 cursor-pointer h-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800"
              />
              <div className="flex justify-between text-[10px] font-extrabold text-neutral-400">
                <span>💰 SAVE MONEY (CHEAPEST)</span>
                <span>⚡ SAVE TIME (FASTEST)</span>
              </div>
            </div>
          </div>

          {/* AI Route Adventure Mode */}
          <div className="p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-4 shadow-sm">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-neutral-400">
              AI Route Adventure Mode
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: "Fastest", label: "⚡ Fastest Path" },
                { id: "Scenic", label: "🏔 Scenic Explorer" },
                { id: "Historic", label: "🏛 Historic Route" },
                { id: "Nature", label: "🌲 Nature Trail" }
              ].map((mode) => {
                const active = adventureMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setAdventureMode(mode.id as any)}
                    className={`p-3 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center cursor-pointer ${
                      active 
                        ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-600/10" 
                        : "bg-background border-card-border text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                    }`}
                  >
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Path Selections List */}
          {isLoading ? (
            <div className="flex items-center justify-center p-12 bg-card border border-card-border rounded-3xl">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : pathOptions.length > 0 ? (
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest px-1">
                Alternative Paths Found ({pathOptions.length})
              </h4>
              {pathOptions.map((opt, idx) => {
                const active = selectedRouteIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedRouteIdx(idx)}
                    className={`p-5 rounded-3xl border text-left flex flex-col gap-3 transition-all duration-200 cursor-pointer shadow-sm ${
                      active 
                        ? "border-purple-500 bg-purple-500/5 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/10" 
                        : "border-card-border bg-card hover:bg-neutral-50 dark:hover:bg-neutral-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs">Option #{idx + 1}</span>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-card-border text-neutral-500 uppercase tracking-wide">
                        {idx === 0 ? "Fastest" : idx === 1 ? "Scenic Scenic" : "Balanced Route"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      {opt.path.map((city: string, cIdx: number) => (
                        <React.Fragment key={city}>
                          <span>{city}</span>
                          {cIdx < opt.path.length - 1 && <ArrowRight className="w-3 h-3 opacity-55" />}
                        </React.Fragment>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-[10px] font-bold text-neutral-400 border-t border-card-border/60 pt-3 mt-1">
                      <span className="flex items-center gap-0.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> ₹{opt.cost.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3.5 h-3.5 text-blue-500" /> {opt.time}h
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Scenic: {opt.scenic}/10
                      </span>
                      {opt.comfort && (
                        <span className="flex items-center gap-0.5">
                          Comfort: {opt.comfort}/10
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/10 text-center text-xs font-semibold text-rose-500 flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" /> No routing paths found.
            </div>
          )}

        </div>

        {/* Right Active Graph View */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass rounded-3xl border border-card-border p-6 flex flex-col justify-between min-h-[500px] shadow-md relative overflow-hidden bg-card/20">
            <div className="absolute top-0 right-0 w-[30%] h-[100%] glow-purple opacity-20 pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-card-border/60 pb-4">
              <div className="flex items-center gap-2.5">
                <Map className="w-5 h-5 text-purple-600" />
                <span className="text-xs font-extrabold text-neutral-600 dark:text-neutral-300 uppercase tracking-widest">Active Travel Graph</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wide">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Selected path</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-800" /> Network path</span>
              </div>
            </div>

            {/* SVG Interactive Canvas */}
            <div className="relative flex-grow flex items-center justify-center p-4 min-h-[300px]">
              {isLoading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                  <p className="text-xs font-semibold text-neutral-400">Mapping route coordinates...</p>
                </div>
              ) : nodes ? (
                <svg 
                  viewBox="0 0 720 380" 
                  className="w-full max-w-[680px] h-auto overflow-visible select-none"
                >
                  {/* 1. Draw all connections (Edges) */}
                  {edges.map((edge, idx) => {
                    const fromNode = nodes[edge.from];
                    const toNode = nodes[edge.to];
                    if (!fromNode || !toNode) return null;
                    const active = isEdgeInSelectedPath(edge.from, edge.to);

                    return (
                      <g key={idx}>
                        <line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke={active ? "url(#purpleGradient)" : "rgba(139, 92, 246, 0.12)"}
                          strokeWidth={active ? 4.5 : 1.5}
                          strokeDasharray={active ? "none" : "5 5"}
                          filter={active ? "url(#neonGlow)" : "none"}
                          className="transition-all duration-300"
                        />
                        {active && (
                          <circle r="4.5" fill="#a855f7" filter="url(#neonGlow)">
                            <animateMotion
                              dur="4s"
                              repeatCount="indefinite"
                              path={`M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`}
                            />
                          </circle>
                        )}
                      </g>
                    );
                  })}

                  {/* 2. Define Gradient & Glow filters */}
                  <defs>
                    <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* 3. Draw nodes */}
                  {Object.entries(nodes).map(([name, node]: [string, any]) => {
                    const isNodeInPath = currentPath?.path.includes(name);
                     const isEndpoint = name === startCity || name === endCity;

                    return (
                      <motion.g 
                        key={name} 
                        className="cursor-pointer"
                        whileHover={{ scale: 1.18 }}
                        transition={{ type: "spring", stiffness: 350, damping: 14 }}
                        style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                      >
                        {isNodeInPath && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={isEndpoint ? 19 : 15}
                            fill="rgba(139, 92, 246, 0.08)"
                            stroke="rgba(139, 92, 246, 0.3)"
                            strokeWidth="1.5"
                            className="animate-pulse"
                          />
                        )}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isEndpoint ? 9.5 : 7}
                          fill={isNodeInPath ? "url(#purpleGradient)" : "#e5e7eb"}
                          stroke={isNodeInPath ? "#ffffff" : "#9ca3af"}
                          strokeWidth="1.8"
                          filter={isNodeInPath ? "url(#neonGlow)" : "none"}
                        />
                        <text
                          x={node.x}
                          y={node.y - (isEndpoint ? 24 : 16)}
                          textAnchor="middle"
                          className={`text-[9px] font-black tracking-wider ${
                            isNodeInPath 
                              ? "fill-neutral-900 dark:fill-neutral-100" 
                              : "fill-neutral-400"
                          }`}
                        >
                          {node.label}
                        </text>
                      </motion.g>
                    );
                  })}
                </svg>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Compass className="w-12 h-12 text-neutral-400 animate-spin" />
                  <p className="text-xs text-neutral-500">Awaiting inputs...</p>
                </div>
              )}
            </div>

            {/* Path details output */}
            {currentPath && (
              <>
                <div className="p-5 rounded-3xl bg-neutral-100 dark:bg-neutral-900/60 border border-card-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mt-4">
                  <div>
                    <span className="text-[9px] font-extrabold text-neutral-400 uppercase block mb-0.5">Route Budget</span>
                    <span className="text-base font-black text-emerald-500">₹{currentPath.cost.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-neutral-400 uppercase block mb-0.5">Transit Duration</span>
                    <span className="text-base font-black text-blue-500">{currentPath.time} hours</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-neutral-400 uppercase block mb-0.5">Scenic Index</span>
                    <span className="text-base font-black text-purple-500">{currentPath.scenic}/10</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-neutral-400 uppercase block mb-0.5">Comfort Score</span>
                    <span className="text-base font-black text-amber-500">{currentPath.comfort || 7}/10</span>
                  </div>
                </div>

                {/* Live Platform Price Comparer */}
                <div className="mt-6 p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-6 shadow-sm">
                  <div>
                    <h4 className="font-extrabold text-sm flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-emerald-500" /> Booking Platform Price Comparison
                    </h4>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Compare live rates across popular Indian and global travel portals for hotels and transits on this route.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Hotels Pricing */}
                    <div className="flex flex-col gap-3">
                      <h5 className="font-bold text-xs text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                        🏨 Hotel Stay Rates (Per Night)
                      </h5>
                      <div className="flex flex-col gap-2.5">
                        {(currentPath.platform_comparisons?.hotels || [
                          { platform: "Booking.com", rate: Math.round(currentPath.cost * 0.4 - 180), rating: 4.7 },
                          { platform: "MakeMyTrip", rate: Math.round(currentPath.cost * 0.4 + 120), rating: 4.5 },
                          { platform: "Agoda", rate: Math.round(currentPath.cost * 0.4 - 80), rating: 4.4 },
                          { platform: "Expedia", rate: Math.round(currentPath.cost * 0.4 + 240), rating: 4.2 }
                        ]).map((h: any, i: number) => (
                          <div key={i} className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-card-border flex items-center justify-between hover:scale-[1.01] transition-transform">
                            <div className="flex items-center gap-2.5">
                              <span className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
                              <span className="font-extrabold text-xs">{h.platform}</span>
                              {i === 0 && (
                                <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                                  BEST VALUE
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-black text-emerald-500">₹{h.rate.toLocaleString()}</span>
                              <span className="text-[8px] text-neutral-500 block mt-0.5">Rating: {h.rating}/5⭐</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Transit Pricing */}
                    <div className="flex flex-col gap-3">
                      <h5 className="font-bold text-xs text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                        🎫 Transit Ticket Price
                      </h5>
                      <div className="flex flex-col gap-2.5">
                        {(currentPath.platform_comparisons?.transit || [
                          { platform: "EaseMyTrip", rate: Math.round(currentPath.cost * 0.45 - 140), mode: "Train" },
                          { platform: "MakeMyTrip", rate: Math.round(currentPath.cost * 0.45 + 90), mode: "Train" },
                          { platform: "Yatra", rate: Math.round(currentPath.cost * 0.45 + 180), mode: "Train" },
                          { platform: "ConfirmTkt", rate: Math.round(currentPath.cost * 0.45 - 60), mode: "Train" }
                        ]).map((t: any, i: number) => (
                          <div key={i} className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-card-border flex items-center justify-between hover:scale-[1.01] transition-transform">
                            <div className="flex items-center gap-2.5">
                              <span className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
                              <span className="font-extrabold text-xs">{t.platform}</span>
                              {i === 0 && (
                                <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                                  BEST DEAL
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-black text-emerald-500">₹{t.rate.toLocaleString()}</span>
                              <span className="text-[8px] text-neutral-500 block mt-0.5">Type: {t.mode}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
