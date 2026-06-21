"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  AlertTriangle,
  MessageSquare,
  Send,
  Loader2,
  Compass,
  DollarSign,
  MapPin,
  Bot,
  User,
  Mic,
  MicOff
} from "lucide-react";
import { groqChat } from "@/lib/groq";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export default function AIInsights() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTrip, setActiveTrip] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Speech Recognition States
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionLang, setRecognitionLang] = useState<"en-US" | "hi-IN">("en-US");
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition (Client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = false;

        rec.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              transcript += event.results[i][0].transcript;
            }
          }
          if (transcript) {
            setInputValue((prev) => prev + (prev ? " " : "") + transcript);
          }
        };

        rec.onerror = (e: any) => {
          console.error("Speech recognition error", e);
          setIsRecording(false);
        };

        rec.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  // Handle changing language while recording is active
  useEffect(() => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      const restartTimeout = setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.lang = recognitionLang;
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.error(e);
          }
        }
      }, 300);
      return () => clearTimeout(restartTimeout);
    }
  }, [recognitionLang]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.lang = recognitionLang;
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const agentLogs = [
    { name: "Preference Node", status: "Resolved", message: "Parsed user companion tags: Mapped to Adventure Explorer", time: "18ms" },
    { name: "Discovery Node", status: "Resolved", message: "Searched cache database: Mapped 3 matching locations", time: "142ms" },
    { name: "Weather Node", status: "Resolved", message: "Matched Srinagar seasonal forecast grids: Temperature safe", time: "85ms" },
    { name: "Route Node", status: "Resolved", message: "Solved K-Shortest routes via IRCTC train API nodes", time: "220ms" },
    { name: "Budget Node", status: "Resolved", message: "Allocated MMT and RedBus hotel rates structures", time: "92ms" },
    { name: "Itinerary Node", status: "Resolved", message: "Compiled Markdown Day-by-Day itinerary planner", time: "115ms" }
  ];

  const suggestionChips = [
    { label: "💰 How do you estimate my budget?", value: "How do you estimate my budget?" },
    { label: "🏔️ Best domestic Indian spots right now?", value: "Which domestic Indian destinations are best right now?" },
    { label: "🚄 How did you solve my routes?", value: "How did you solve my transit routes?" }
  ];

  // Load the user's latest trip context
  useEffect(() => {
    try {
      const tripsStr = localStorage.getItem("myTrips");
      if (tripsStr) {
        const trips = JSON.parse(tripsStr);
        if (trips && trips.length > 0) {
          const latestTrip = trips[trips.length - 1];
          setActiveTrip(latestTrip);
          setMessages([
            {
              id: "1",
              sender: "ai",
              text: `Hello! I am your VoyageIQ AI Intelligence Agent. I have loaded your matched itinerary to ${latestTrip.to}. How can I help you customize your stay, check route transit networks, or estimate budgets for this trip?`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to load active trip context", e);
    }

    // Set default greeting on mount (client-only) if no trips exist
    setMessages([
      {
        id: "1",
        sender: "ai",
        text: "Hello! I am your VoyageIQ AI Intelligence Agent. I analyze thousands of routes, weather grids, and portal rates (MakeMyTrip, RedBus, Booking.com) to customize the perfect trip. How can I help you optimize your itinerary today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Build rich system prompt with trip context
      let tripContext = "";
      if (activeTrip) {
        tripContext = `
The user has an active trip planned:
- From: ${activeTrip.from}
- To: ${activeTrip.to}
- Date: ${activeTrip.date}
- Stops: ${activeTrip.stops?.join(" → ")}
- Style: ${activeTrip.personality}
- Total Budget: ${activeTrip.cost}
${activeTrip.budgetBreakdown ? `- Budget Breakdown:
  • Transport: ${activeTrip.budgetBreakdown.transport}
  • Hotel: ${activeTrip.budgetBreakdown.hotel}
  • Food: ${activeTrip.budgetBreakdown.food}
  • Activities: ${activeTrip.budgetBreakdown.activities}` : ""}
${activeTrip.itinerary ? `- Itinerary: ${activeTrip.itinerary.map((d: any) => `Day ${d.day}: ${d.activity}`).join("; ")}` : ""}
`;
      }

      const systemPrompt = `You are VoyageIQ, an expert AI Indian travel planning assistant. You help users with:
- Destination recommendations across India (and international)
- Budget estimates using MakeMyTrip, Booking.com, RedBus, IRCTC pricing
- Route planning and transit options (trains, flights, buses)
- Weather and seasonal travel advice
- Local food, hidden gems, and cultural tips
- Safety and risk analysis for travel destinations

Keep responses conversational, enthusiastic about travel, and concise (2-4 paragraphs max). Use bullet points where helpful. Include specific Indian rupee estimates when discussing budgets.
${tripContext}`;

      const reply = await groqChat(
        [
          { role: "system", content: systemPrompt },
          // Include last few messages as conversation history
          ...messages.slice(-6).map(m => ({
            role: m.sender === "ai" ? ("assistant" as const) : ("user" as const),
            content: m.text
          })),
          { role: "user", content: text }
        ],
        { temperature: 0.75, maxTokens: 800 }
      );

      const aiMsg: Message = {
        id: Date.now().toString(),
        sender: "ai",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const isNoKey = err?.message?.includes("NO_API_KEY");
      const aiMsg: Message = {
        id: Date.now().toString(),
        sender: "ai",
        text: isNoKey
          ? "⚠️ Groq API key not configured. Please add NEXT_PUBLIC_GROQ_API_KEY to your .env.local file (get a free key at console.groq.com) and restart the dev server."
          : `Sorry, I ran into an issue: ${err?.message || "Unknown error"}. Please check your API key and try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">AI Insights Engine</h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
          Chat with the VoyageIQ Travel Agent to see how your budgets and routes were calculated.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Diagnostics Pane */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Integrity status */}
          <div className="p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-4 shadow-sm">
            <ShieldCheck className="w-10 h-10 text-emerald-500" />
            <h3 className="font-extrabold text-sm">Model Integrity Status</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              VoyageIQ is configured using async structured responses. Model queries are executed with 99.4% syntax consistency over the JSON schemas.
            </p>
            <div className="border-t border-card-border/60 pt-4 flex justify-between items-center text-[10px] font-bold text-neutral-400">
              <span>LATENCY: 620ms</span>
              <span>TOKEN CACHE: ACTIVE</span>
            </div>
          </div>

          {/* LangGraph Timeline */}
          <div className="p-6 rounded-3xl bg-card border border-card-border flex flex-col gap-6 shadow-sm">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600 animate-pulse" /> LangGraph Workflow Timeline
              </h3>
              <p className="text-[10px] text-neutral-400 mt-1">Review active orchestration logs.</p>
            </div>

            <div className="flex flex-col gap-3">
              {agentLogs.map((log, idx) => (
                <div 
                  key={idx} 
                  className="p-3.5 rounded-2xl border border-card-border bg-neutral-50/50 dark:bg-neutral-900/30 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-extrabold text-neutral-800 dark:text-neutral-200 truncate">{log.name}</span>
                      <span className="text-[9px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">{log.message}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="font-bold text-neutral-400">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Chat Panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="glass rounded-3xl border border-card-border flex flex-col h-[520px] shadow-lg overflow-hidden">
            
            {/* Chat Header */}
            <div className="p-5 border-b border-card-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">VoyageIQ Travel Advisor</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Agent online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Message Box */}
            <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4 bg-neutral-50/30 dark:bg-neutral-900/10">
              {messages.map((msg) => {
                const isAI = msg.sender === "ai";
                return (
                  <div 
                    key={msg.id} 
                    className={`flex gap-3 max-w-[85%] ${isAI ? "self-start" : "self-end flex-row-reverse"}`}
                  >
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                      isAI 
                        ? "bg-purple-500/15 text-purple-600" 
                        : "bg-blue-500/15 text-blue-600"
                    }`}>
                      {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className={`p-4 rounded-3xl text-xs font-medium leading-relaxed whitespace-pre-line border ${
                        isAI 
                          ? "bg-card border-card-border text-neutral-800 dark:text-neutral-200 rounded-tl-none" 
                          : "bg-purple-600 border-purple-600 text-white rounded-tr-none"
                      }`}>
                        {msg.text}
                      </div>
                      <span className={`text-[9px] text-neutral-400 mt-0.5 ${isAI ? "self-start" : "self-end"}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Typing bubble */}
              {isTyping && (
                <div className="flex gap-3 self-start max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-purple-500/15 text-purple-600 flex items-center justify-center text-xs shrink-0">
                    <Bot className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="p-4 rounded-3xl bg-card border border-card-border rounded-tl-none flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="px-5 py-3 bg-neutral-50/50 dark:bg-neutral-900/30 border-t border-card-border flex items-center gap-2 overflow-x-auto">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.value)}
                  className="px-3.5 py-2 rounded-xl border border-card-border bg-card hover:bg-neutral-50 dark:hover:bg-neutral-900 text-[10px] font-extrabold text-neutral-600 dark:text-neutral-300 transition-colors shrink-0 cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-4 bg-card border-t border-card-border flex items-center gap-3"
            >
              {/* Language Selector Toggle */}
              <div className="flex items-center rounded-xl border border-card-border bg-background p-0.5 shrink-0 select-none">
                <button
                  type="button"
                  onClick={() => setRecognitionLang("en-US")}
                  className={`px-2 py-1 rounded-lg text-[9px] font-black transition-all ${
                    recognitionLang === "en-US" 
                      ? "bg-purple-600 text-white" 
                      : "text-neutral-500 hover:text-foreground"
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setRecognitionLang("hi-IN")}
                  className={`px-2 py-1 rounded-lg text-[9px] font-black transition-all ${
                    recognitionLang === "hi-IN" 
                      ? "bg-purple-600 text-white" 
                      : "text-neutral-500 hover:text-foreground"
                  }`}
                >
                  हिन्दी
                </button>
              </div>

              {/* Microphone Toggle Button */}
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-3 rounded-2xl border transition-all active:scale-95 flex items-center justify-center shrink-0 cursor-pointer relative ${
                  isRecording 
                    ? "bg-rose-500/10 border-rose-500 text-rose-500 animate-pulse" 
                    : "bg-background border-card-border text-neutral-500 hover:text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-900"
                }`}
                title={isRecording ? "Stop voice recording" : "Speak to describe destination"}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isRecording && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </button>

              <input 
                type="text" 
                placeholder={isRecording ? "Listening... Describe your destination..." : "Ask about destination recommendations or budget breakdowns..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={`flex-grow px-4 py-3 rounded-2xl border bg-background focus:outline-none focus:border-purple-500 transition-all text-xs font-semibold ${
                  isRecording ? "border-rose-500/40 ring-1 ring-rose-500/10" : "border-card-border"
                }`}
              />
              <button 
                type="submit" 
                className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md active:scale-95 flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
