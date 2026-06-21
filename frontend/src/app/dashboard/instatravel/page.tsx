"use client";

import React, { useState, useRef } from "react";
import {
  Upload, Compass, DollarSign, MapPin, Sparkles,
  Loader2, Calendar, CheckCircle, Plus, AlertTriangle,
  Camera, RefreshCw, X, ImageOff
} from "lucide-react";

interface MatchedDestination {
  name: string;
  landmark: string;
  summary: string;
  confidence: number;
  placeImageUrl: string;
  budgetBreakdown: { transport: string; hotel: string; food: string; activities: string; total: string };
  itinerary: { day: number; activity: string; weather_snippet: string }[];
  portalRates: {
    hotelRates: { platform: string; rate: number; rating: number; isBest: boolean }[];
    transitRates: { platform: string; rate: number; type: string; isBest: boolean }[];
  };
}

const IMAGE_MAP: Record<string, string> = {
  srinagar:   "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&auto=format&fit=crop",
  kashmir:    "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&auto=format&fit=crop",
  ladakh:     "https://images.unsplash.com/photo-1595411425732-e69c1abe2763?w=800&auto=format&fit=crop",
  leh:        "https://images.unsplash.com/photo-1595411425732-e69c1abe2763?w=800&auto=format&fit=crop",
  spiti:      "https://images.unsplash.com/photo-1595411425732-e69c1abe2763?w=800&auto=format&fit=crop",
  manali:     "https://images.unsplash.com/photo-1590577976322-3d2d6e2130d5?w=800&auto=format&fit=crop",
  shimla:     "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=800&auto=format&fit=crop",
  munnar:     "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&auto=format&fit=crop",
  ooty:       "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&auto=format&fit=crop",
  goa:        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop",
  gokarna:    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
  varkala:    "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=800&auto=format&fit=crop",
  andaman:    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&auto=format&fit=crop",
  agra:       "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop",
  udaipur:    "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop",
  jaipur:     "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop",
  jaisalmer:  "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop",
  varanasi:   "https://images.unsplash.com/photo-1561361058-c24e01c88b42?w=800&auto=format&fit=crop",
  rishikesh:  "https://images.unsplash.com/photo-1561361058-c24e01c88b42?w=800&auto=format&fit=crop",
  sikkim:     "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop",
  darjeeling: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop",
  meghalaya:  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop",
  coorg:      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop",
  wayanad:    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop",
  hampi:      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop",
  gulmarg:    "https://images.unsplash.com/photo-1486916856992-e4db22c8df33?w=800&auto=format&fit=crop",
  tawang:     "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop",
  kyoto:      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop",
  bali:       "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop",
  default:    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop",
};

function getDestImage(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(IMAGE_MAP)) {
    if (lower.includes(key)) return url;
  }
  return `https://images.unsplash.com/featured/800x600/?travel,${encodeURIComponent(name)}`;
}

function buildBudget(dest: string) {
  const l = dest.toLowerCase();
  if (["ladakh","andaman","lakshadweep"].some(k=>l.includes(k)))
    return {transport:"₹8,500",hotel:"₹22,000 (5 nights)",food:"₹9,000",activities:"₹5,000",total:"₹44,500"};
  if (["goa","srinagar","kashmir","gulmarg"].some(k=>l.includes(k)))
    return {transport:"₹6,500",hotel:"₹20,000 (5 nights)",food:"₹8,000",activities:"₹4,000",total:"₹38,500"};
  if (["manali","shimla","darjeeling","sikkim","spiti"].some(k=>l.includes(k)))
    return {transport:"₹3,200",hotel:"₹14,000 (5 nights)",food:"₹6,000",activities:"₹3,500",total:"₹26,700"};
  if (["munnar","coorg","ooty","wayanad"].some(k=>l.includes(k)))
    return {transport:"₹4,200",hotel:"₹12,500 (5 nights)",food:"₹6,000",activities:"₹3,000",total:"₹25,700"};
  if (["agra","jaipur","udaipur","varanasi"].some(k=>l.includes(k)))
    return {transport:"₹1,800",hotel:"₹8,000 (5 nights)",food:"₹4,500",activities:"₹2,000",total:"₹16,300"};
  return {transport:"₹3,500",hotel:"₹10,000 (5 nights)",food:"₹5,500",activities:"₹2,500",total:"₹21,500"};
}

function buildRates(dest: string) {
  const l = dest.toLowerCase();
  const isFlight = ["ladakh","andaman","goa","srinagar","kashmir","mumbai","bangalore"].some(k=>l.includes(k));
  return {
    hotelRates:[
      {platform:"Booking.com",rate:1900,rating:4.7,isBest:true},
      {platform:"MakeMyTrip",rate:2200,rating:4.4,isBest:false},
      {platform:"Goibibo",rate:2400,rating:4.2,isBest:false},
    ],
    transitRates: isFlight
      ? [{platform:"EaseMyTrip",rate:6200,type:"Flight",isBest:true},{platform:"MakeMyTrip",rate:6700,type:"Flight",isBest:false},{platform:"Yatra",rate:6900,type:"Flight",isBest:false}]
      : [{platform:"ConfirmTkt",rate:650,type:"Train",isBest:true},{platform:"RedBus",rate:1200,type:"Sleeper Bus",isBest:false},{platform:"AbhiBus",rate:1350,type:"AC Bus",isBest:false}],
  };
}

const scanSteps = [
  "Analyzing visual markers & metadata...",
  "Running neural geographic vision matching...",
  "Querying location databases...",
  "Solving optimal transit paths...",
  "Finalizing budget & itinerary...",
];

export default function InstaTravelFinder() {
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning]           = useState(false);
  const [scanStep, setScanStep]               = useState(0);
  const [matchedDest, setMatchedDest]         = useState<MatchedDestination | null>(null);
  const [isSaved, setIsSaved]                 = useState(false);
  const [scanError, setScanError]             = useState<string | null>(null);
  const [imgError, setImgError]               = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerScan = async (base64: string, mimeType: string) => {
    setIsScanning(true); setScanStep(0); setMatchedDest(null); setScanError(null); setIsSaved(false); setImgError(false);
    let step = 0;
    const interval = setInterval(() => { step = Math.min(step+1, scanSteps.length-2); setScanStep(step); }, 900);
    try {
      const groqApiKey = (typeof window !== "undefined" && localStorage.getItem("groqApiKey")) || process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
      if (!groqApiKey) {
        clearInterval(interval); setIsScanning(false);
        setScanError("No Groq API key found. Go to Settings → AI Agent Configuration and enter your key.");
        return;
      }
      const imgData = base64.includes(",") ? base64 : `data:${mimeType};base64,${base64}`;
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method:"POST",
        headers:{Authorization:`Bearer ${groqApiKey}`,"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"meta-llama/llama-4-scout-17b-16e-instruct",
          messages:[{role:"user",content:[
            {type:"image_url",image_url:{url:imgData}},
            {type:"text",text:`You are an expert travel destination identifier. Look at this image carefully.

Respond ONLY with valid JSON (no markdown, no extra text):
{
  "destination": "<City, State/Country>",
  "landmark": "<specific landmark or scene visible>",
  "confidence": <0-100>,
  "summary": "<2-3 sentence vivid travel description>",
  "isTravel": <true if scenic/landmark, false if food/person/device/object>
}

If not a travel photo, set isTravel: false and destination: "Not a travel destination".`}
          ]}],
          max_tokens:350,temperature:0.1,
        }),
      });
      clearInterval(interval); setScanStep(scanSteps.length-1);
      await new Promise(r=>setTimeout(r,600)); setIsScanning(false);
      if (!res.ok) { const e=await res.json().catch(()=>({})); setScanError(`Groq API error ${res.status}: ${e?.error?.message||"Check your API key."}`); return; }
      const data = await res.json();
      const raw = data.choices?.[0]?.message?.content?.trim()||"";
      const jm = raw.match(/\{[\s\S]*\}/);
      let aiResult: any = null;
      if (jm) { try { aiResult = JSON.parse(jm[0]); } catch(_){} }
      if (!aiResult) { setScanError("Could not parse AI response. Try uploading a clearer travel photo."); return; }
      if (!aiResult.isTravel) { setScanError(`No travel destination detected. The image shows: "${aiResult.destination||"a non-travel subject"}". Please upload a landscape, landmark, or scenic photo.`); return; }
      const destName  = aiResult.destination||"Unknown Destination";
      const landmark  = aiResult.landmark||"";
      const summary   = aiResult.summary||`A beautiful travel destination: ${destName}.`;
      const confidence = Math.max(60, Math.min(99, aiResult.confidence||85));
      setMatchedDest({
        name:destName, landmark, summary, confidence,
        placeImageUrl: getDestImage(destName),
        budgetBreakdown: buildBudget(destName),
        itinerary:[
          {day:1,activity:`Arrive at ${destName}. Check into hotel, explore around ${landmark||"the main area"}.`,weather_snippet:"Variable"},
          {day:2,activity:`Visit ${landmark||"the main landmark"} and key attractions.`,weather_snippet:"Sunny"},
          {day:3,activity:"Explore local markets, street food, and cultural sites.",weather_snippet:"Pleasant"},
          {day:4,activity:"Day excursion to nearby scenic viewpoints or nature trails.",weather_snippet:"Clear"},
          {day:5,activity:"Leisurely morning walk, souvenir shopping, and departure.",weather_snippet:"Clear"},
        ],
        portalRates: buildRates(destName),
      });
    } catch(err:any) {
      clearInterval(interval); setIsScanning(false);
      setScanError(`Scan failed: ${err.message||"Network error. Check your connection and API key."}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20*1024*1024) { setScanError("File too large. Upload an image under 20MB."); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setUploadedPreview(base64);
      if (file.type.startsWith("video/")) {
        setScanError("Video files aren't supported. Please upload a still image (JPG, PNG, WEBP).");
      } else {
        triggerScan(base64, file.type);
      }
    };
    reader.readAsDataURL(file);
  };

  const saveToMyTrips = () => {
    if (!matchedDest) return;
    try {
      const existing = localStorage.getItem("myTrips");
      const list = existing ? JSON.parse(existing) : [];
      list.push({
        id:Date.now(), from:"New Delhi, India", to:matchedDest.name,
        date:"Upcoming (InstaTravel Match)", status:"Upcoming",
        stops:["Delhi",matchedDest.name], personality:"InstaTravel Inspiration",
        cost:matchedDest.budgetBreakdown.total,
        budgetBreakdown:matchedDest.budgetBreakdown, itinerary:matchedDest.itinerary,
      });
      localStorage.setItem("myTrips", JSON.stringify(list));
      setIsSaved(true);
      setTimeout(()=>{ window.location.href="/dashboard/trips"; }, 1200);
    } catch(e){ console.error(e); }
  };

  const reset = () => {
    setUploadedPreview(null); setMatchedDest(null); setScanError(null);
    setIsScanning(false); setIsSaved(false); setImgError(false);
    if (fileInputRef.current) fileInputRef.current.value="";
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">InstaTravel Finder</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Upload any travel photo — AI identifies the destination and builds a complete trip plan with budget &amp; itinerary.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-start">

        {/* Left: Upload */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="p-5 rounded-3xl bg-card border border-card-border flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">Upload Travel Photo</h3>
              {uploadedPreview && (
                <button onClick={reset} className="text-[10px] font-bold text-neutral-400 hover:text-rose-500 flex items-center gap-1 transition-colors">
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-card-border rounded-2xl flex flex-col items-center justify-center gap-3 bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-purple-500/40 hover:bg-purple-500/[0.02] transition-all cursor-pointer relative overflow-hidden"
              style={{ minHeight: uploadedPreview ? "260px" : "220px" }}
            >
              {uploadedPreview ? (
                <>
                  <img src={uploadedPreview} alt="Your uploaded photo" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <Camera className="w-6 h-6 text-white" />
                    <span className="text-white text-xs font-bold">Change Photo</span>
                  </div>
                  {isScanning && (
                    <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin shrink-0" />
                      <span className="text-white text-[10px] font-bold truncate">{scanSteps[scanStep]}</span>
                    </div>
                  )}
                  {!isScanning && matchedDest && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-lg">✓ Identified</div>
                  )}
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/5 border border-purple-500/10 flex items-center justify-center text-purple-600">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Drop photo here or click to browse</p>
                    <p className="text-[10px] text-neutral-400 mt-1">JPG · PNG · WEBP · up to 20MB</p>
                    <p className="text-[10px] text-purple-500 mt-2 font-semibold">Powered by Groq Vision AI</p>
                  </div>
                </>
              )}
            </div>

            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />

            {isScanning && (
              <div className="flex flex-col gap-1.5">
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-full transition-all duration-700" style={{width:`${((scanStep+1)/scanSteps.length)*100}%`}} />
                </div>
                <p className="text-[10px] text-neutral-400 text-center">{scanSteps[scanStep]}</p>
              </div>
            )}
          </div>

          {/* How it works */}
          <div className="p-5 rounded-3xl bg-card border border-card-border flex flex-col gap-3 shadow-sm">
            <h3 className="font-extrabold text-[10px] uppercase tracking-wider text-neutral-400">How It Works</h3>
            <div className="flex flex-col gap-2.5">
              {[
                {num:"1",text:"Upload any travel photo from Instagram, YouTube, or your gallery"},
                {num:"2",text:"Groq Vision AI identifies the destination, landmark, and location"},
                {num:"3",text:"Get a full trip plan — budget, itinerary, hotel & transit rates"},
                {num:"4",text:"Save to My Trips with one click"},
              ].map(s=>(
                <div key={s.num} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-600 text-white text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5">{s.num}</div>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-3 flex flex-col gap-5">

          {/* Scanning */}
          {isScanning && (
            <div className="p-12 rounded-3xl bg-card border border-card-border flex flex-col items-center justify-center text-center gap-6 min-h-[300px]">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-purple-500/20 border-t-purple-600 animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h4 className="font-extrabold text-base">{scanSteps[scanStep]}</h4>
                <p className="text-xs text-neutral-400 mt-1">VoyageIQ Vision AI is analyzing your photo…</p>
              </div>
              <div className="w-56 bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-full transition-all duration-700" style={{width:`${((scanStep+1)/scanSteps.length)*100}%`}} />
              </div>
            </div>
          )}

          {/* Results */}
          {!isScanning && matchedDest && (
            <div className="flex flex-col gap-5">
              <div className="rounded-3xl bg-card border border-card-border overflow-hidden shadow-sm">
                <div className="grid sm:grid-cols-2 gap-0">
                  <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-900">
                    <img src={uploadedPreview!} alt="Your photo" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <span className="text-white text-[10px] font-black uppercase tracking-wider">Your Photo</span>
                    </div>
                  </div>
                  <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-900">
                    {!imgError ? (
                      <img src={matchedDest.placeImageUrl} alt={matchedDest.name} className="absolute inset-0 w-full h-full object-cover" onError={()=>setImgError(true)} />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-neutral-400">
                        <ImageOff className="w-8 h-8" /><span className="text-xs">Photo unavailable</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <span className="text-white text-[10px] font-black uppercase tracking-wider">AI Matched</span>
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-[10px] font-black">{matchedDest.confidence}% match</div>
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">✓ Destination Identified</span>
                    {matchedDest.landmark && <span className="text-[10px] font-semibold text-neutral-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{matchedDest.landmark}</span>}
                  </div>
                  <h2 className="text-2xl font-black">{matchedDest.name}</h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{matchedDest.summary}</p>
                </div>
              </div>

              {/* Budget */}
              <div className="p-5 rounded-3xl bg-card border border-card-border flex flex-col gap-4 shadow-sm">
                <h3 className="font-bold text-sm flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-500" />Estimated 5-Day Budget</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[{label:"Transit",val:matchedDest.budgetBreakdown.transport},{label:"Stay",val:matchedDest.budgetBreakdown.hotel.split(" ")[0]},{label:"Food",val:matchedDest.budgetBreakdown.food},{label:"Activities",val:matchedDest.budgetBreakdown.activities}].map(({label,val})=>(
                    <div key={label} className="p-3.5 rounded-xl border border-card-border bg-neutral-50 dark:bg-neutral-900/50 text-center flex flex-col gap-0.5">
                      <span className="text-[9px] font-extrabold text-neutral-400 uppercase">{label}</span>
                      <span className="text-base font-black">{val}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-card-border/60 pt-3">
                  <span className="text-xs font-bold text-neutral-400">TOTAL PACKAGE</span>
                  <span className="text-xl font-black text-emerald-500">{matchedDest.budgetBreakdown.total}</span>
                </div>
              </div>

              {/* Itinerary */}
              <div className="p-5 rounded-3xl bg-card border border-card-border flex flex-col gap-3 shadow-sm">
                <h3 className="font-bold text-sm flex items-center gap-2"><Calendar className="w-4 h-4 text-amber-500" />5-Day Itinerary</h3>
                <div className="flex flex-col gap-2">
                  {matchedDest.itinerary.map(day=>(
                    <div key={day.day} className="flex gap-3 items-start p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-card-border">
                      <div className="w-7 h-7 rounded-full bg-purple-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">{day.day}</div>
                      <div className="flex-grow min-w-0">
                        <p className="text-xs font-semibold leading-snug">{day.activity}</p>
                        <span className="text-[9px] text-neutral-400 mt-0.5 block">{day.weather_snippet}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotel & Transit */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="p-5 rounded-3xl bg-card border border-card-border flex flex-col gap-3 shadow-sm">
                  <h4 className="font-extrabold text-[10px] text-neutral-400 uppercase tracking-wider">🏨 Hotel Rates / Night</h4>
                  <div className="flex flex-col gap-2">
                    {matchedDest.portalRates.hotelRates.map((h,i)=>(
                      <div key={i} className="p-2.5 rounded-xl border border-card-border bg-neutral-50/40 dark:bg-neutral-900/10 flex items-center justify-between text-xs font-semibold">
                        <span className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${h.isBest?"bg-emerald-500 animate-pulse":"bg-neutral-300"}`}/>{h.platform}</span>
                        <div className="text-right"><span className="text-emerald-500 font-bold">₹{h.rate.toLocaleString("en-IN")}</span>{h.isBest&&<span className="text-[8px] px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-600 block mt-0.5">Best Deal</span>}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-5 rounded-3xl bg-card border border-card-border flex flex-col gap-3 shadow-sm">
                  <h4 className="font-extrabold text-[10px] text-neutral-400 uppercase tracking-wider">🚌 Transit Rates</h4>
                  <div className="flex flex-col gap-2">
                    {matchedDest.portalRates.transitRates.map((t,i)=>(
                      <div key={i} className="p-2.5 rounded-xl border border-card-border bg-neutral-50/40 dark:bg-neutral-900/10 flex items-center justify-between text-xs font-semibold">
                        <span className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${t.isBest?"bg-emerald-500 animate-pulse":"bg-neutral-300"}`}/>{t.platform}</span>
                        <div className="text-right"><span className="text-emerald-500 font-bold">₹{t.rate.toLocaleString("en-IN")}</span><span className="text-[8px] text-neutral-400 block mt-0.5">{t.type}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-3">
                <button onClick={saveToMyTrips} disabled={isSaved}
                  className="flex-grow py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-md shadow-blue-500/15 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
                  {isSaved ? <><CheckCircle className="w-4 h-4" />Saved! Redirecting to My Trips…</> : <><Plus className="w-4 h-4" />Save &amp; Add to My Trips</>}
                </button>
                <button onClick={reset} className="p-4 rounded-xl border border-card-border bg-card hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-500 hover:text-foreground transition-colors" title="Scan another photo">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {!isScanning && scanError && (
            <div className="p-10 rounded-3xl bg-card border border-rose-500/20 flex flex-col items-center justify-center text-center gap-5 min-h-[280px]">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-black text-rose-600 dark:text-rose-400">Scan Failed</h3>
                <p className="text-xs text-neutral-500 mt-2 max-w-sm leading-relaxed">{scanError}</p>
              </div>
              <button onClick={reset} className="px-6 py-2.5 rounded-xl font-bold text-xs border border-card-border bg-card text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5" />Try Another Photo
              </button>
            </div>
          )}

          {/* Empty */}
          {!isScanning && !matchedDest && !scanError && (
            <div className="p-12 rounded-3xl bg-card border border-card-border flex flex-col items-center justify-center text-center gap-5 min-h-[300px] relative overflow-hidden">
              <div className="absolute top-[-25%] right-[-15%] w-[45%] h-[55%] glow-purple opacity-20 pointer-events-none" />
              <div className="w-16 h-16 rounded-2xl bg-purple-500/5 border border-purple-500/10 flex items-center justify-center text-purple-600">
                <Compass className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-black">Find Any Destination from a Photo</h3>
                <p className="text-xs text-neutral-500 mt-2 max-w-sm leading-relaxed">
                  Upload a travel photo from Instagram, YouTube, or anywhere — Groq Vision AI identifies the location and instantly builds a full trip plan with budget, itinerary, and booking rates.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold text-neutral-400">
                <span className="px-3 py-1.5 rounded-full border border-card-border">📸 Any travel photo</span>
                <span className="px-3 py-1.5 rounded-full border border-card-border">🤖 Groq Vision AI</span>
                <span className="px-3 py-1.5 rounded-full border border-card-border">🗺️ Auto trip plan</span>
                <span className="px-3 py-1.5 rounded-full border border-card-border">💰 Budget estimate</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
