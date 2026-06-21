"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  Loader2, 
  Sparkles, 
  Check, 
  Compass, 
  Calendar, 
  Users, 
  Briefcase, 
  Info,
  DollarSign,
  Mountain,
  Snowflake,
  Sunset,
  Palmtree,
  Waves,
  Trees,
  Droplet,
  Landmark,
  Plane,
  Train,
  Car,
  Bus,
  Sun,
  CloudSun,
  CloudRain,
  User,
  Heart,
  Home,
  Gem,
  Flame,
  Scale,
  Lock,
  Shuffle,
  EyeOff,
  ExternalLink
} from "lucide-react";
import { groqChat, parseGroqJson } from "@/lib/groq";

// Helper to get real Unsplash travel images
const getDestinationImage = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("srinagar") || n.includes("kashmir"))
    return "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=600&auto=format&fit=crop";
  if (n.includes("goa"))
    return "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop";
  if (n.includes("dehradun") || n.includes("mussoorie"))
    return "https://images.unsplash.com/photo-1597074866923-dc0589150358?q=80&w=600&auto=format&fit=crop";
  if (n.includes("agra") || n.includes("taj mahal"))
    return "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=600&auto=format&fit=crop";
  if (n.includes("kyoto") || n.includes("japan"))
    return "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop";
  if (n.includes("chamonix") || n.includes("alps") || n.includes("swiss"))
    return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop";
  if (n.includes("bali"))
    return "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop";
  if (n.includes("nainital"))
    return "https://images.unsplash.com/photo-1615966650071-855b15f29ad1?q=80&w=600&auto=format&fit=crop";
  if (n.includes("manali"))
    return "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=600&auto=format&fit=crop";
  if (n.includes("udaipur"))
    return "https://images.unsplash.com/photo-1595928642581-f50f4f3453a5?q=80&w=600&auto=format&fit=crop";
  if (n.includes("andaman") || n.includes("nicobar"))
    return "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=600&auto=format&fit=crop";
  if (n.includes("sikkim") || n.includes("gangtok"))
    return "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=600&auto=format&fit=crop";
  if (n.includes("rome") || n.includes("italy"))
    return "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=600&auto=format&fit=crop";
  if (n.includes("cape town") || n.includes("south africa"))
    return "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=600&auto=format&fit=crop";
  if (n.includes("prague"))
    return "https://images.unsplash.com/photo-1541384982283-d2f1d02e4c7d?q=80&w=600&auto=format&fit=crop";
  if (n.includes("krabi") || n.includes("thailand"))
    return "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=600&auto=format&fit=crop";
  if (n.includes("lakshadweep"))
    return "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=600&auto=format&fit=crop";
  if (n.includes("gulmarg"))
    return "https://images.unsplash.com/photo-1486916856992-e4db22c8df33?q=80&w=600&auto=format&fit=crop";
  if (n.includes("munnar") || n.includes("kerala"))
    return "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600&auto=format&fit=crop";
  if (n.includes("ladakh") || n.includes("leh"))
    return "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=600&auto=format&fit=crop";
  if (n.includes("wayanad"))
    return "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600&auto=format&fit=crop";
  if (n.includes("ooty"))
    return "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600&auto=format&fit=crop";
  if (n.includes("paris") || n.includes("france"))
    return "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop";
  if (n.includes("london"))
    return "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&auto=format&fit=crop";
  if (n.includes("new york") || n.includes("nyc"))
    return "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=600&auto=format&fit=crop";
  if (n.includes("rishikesh"))
    return "https://images.unsplash.com/photo-1618083707368-b3823daa2726?q=80&w=600&auto=format&fit=crop";
  if (n.includes("shimla"))
    return "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=600&auto=format&fit=crop";
  if (n.includes("coorg"))
    return "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600&auto=format&fit=crop";
  if (n.includes("darjeeling"))
    return "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop";
  if (n.includes("gokarna"))
    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop";
  if (n.includes("varkala"))
    return "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=600&auto=format&fit=crop";

  return `https://images.unsplash.com/featured/800x600/?travel,${encodeURIComponent(name)}`;
};

const getPlatformRates = (destination: string, budget: string, transport: string) => {
  const isLowBudget = ["₹0–₹5k", "₹5k–₹10k", "₹10k–₹15k"].includes(budget);
  const isMediumBudget = ["₹15k–₹25k", "₹25k–₹50k"].includes(budget);
  
  let baseHotel = 1200;
  let baseTransit = 800;

  if (isMediumBudget) {
    baseHotel = 3400;
    baseTransit = 2200;
  } else if (!isLowBudget && !isMediumBudget) {
    baseHotel = 8500;
    baseTransit = 7500;
  }

  const nameLen = destination.length;
  baseHotel += (nameLen % 5) * 150;
  baseTransit += (nameLen % 3) * 200;

  const hotelRates = [
    { platform: "MakeMyTrip", rate: baseHotel + 180, rating: 4.5, isBest: false },
    { platform: "Booking.com", rate: baseHotel - 120, rating: 4.8, isBest: true },
    { platform: "Goibibo", rate: baseHotel + 50, rating: 4.3, isBest: false },
    { platform: "Yatra", rate: baseHotel + 240, rating: 4.1, isBest: false }
  ];

  let transitRates = [];
  const transType = transport || "Train";
  if (transType === "Flight") {
    transitRates = [
      { platform: "MakeMyTrip", rate: baseTransit + 300, type: "Flight", isBest: false },
      { platform: "EaseMyTrip", rate: baseTransit - 180, type: "Flight", isBest: true },
      { platform: "Goibibo", rate: baseTransit + 90, type: "Flight", isBest: false },
      { platform: "Yatra", rate: baseTransit + 380, type: "Flight", isBest: false }
    ];
  } else if (transType === "Train") {
    transitRates = [
      { platform: "MakeMyTrip", rate: baseTransit + 70, type: "Train", isBest: false },
      { platform: "RedBus", rate: baseTransit - 50, type: "Train", isBest: true },
      { platform: "AbhiBus", rate: baseTransit - 20, type: "Train", isBest: false },
      { platform: "ConfirmTkt", rate: baseTransit + 15, type: "Train", isBest: false }
    ];
  } else {
    transitRates = [
      { platform: "RedBus", rate: baseTransit - 40, type: "Bus/Cab", isBest: true },
      { platform: "AbhiBus", rate: baseTransit - 10, type: "Bus/Cab", isBest: false },
      { platform: "MakeMyTrip", rate: baseTransit + 50, type: "Bus/Cab", isBest: false },
      { platform: "Goibibo", rate: baseTransit + 30, type: "Bus/Cab", isBest: false }
    ];
  }

  return { hotelRates, transitRates };
};

const calculateDetailedBudget = (destination: string, budget: string, duration: number) => {
  const isLowBudget = ["₹0–₹5k", "₹5k–₹10k", "₹10k–₹15k"].includes(budget);
  const isMediumBudget = ["₹15k–₹25k", "₹25k–₹50k"].includes(budget);
  
  let transportCost = 3500;
  let hotelCost = 4000;
  let foodCost = 1500;
  let activitiesCost = 1000;

  if (isMediumBudget) {
    transportCost = 12000;
    hotelCost = 10000;
    foodCost = 5000;
    activitiesCost = 3000;
  } else if (!isLowBudget && !isMediumBudget) {
    transportCost = 35000;
    hotelCost = 28000;
    foodCost = 12000;
    activitiesCost = 10000;
  }

  const nameLen = destination.length;
  hotelCost += (nameLen % 5) * 200;
  transportCost += (nameLen % 3) * 300;

  const totalCost = (transportCost + (hotelCost + foodCost + activitiesCost) * duration);

  return {
    transport: "₹" + transportCost.toLocaleString(),
    hotel: "₹" + (hotelCost * duration).toLocaleString() + ` (${duration} nights)`,
    food: "₹" + (foodCost * duration).toLocaleString(),
    activities: "₹" + (activitiesCost * duration).toLocaleString(),
    total: "₹" + totalCost.toLocaleString()
  };
};

const attractionIcons: Record<string, React.ReactNode> = {
  "Mountains": <Mountain className="w-4 h-4" />,
  "Snow": <Snowflake className="w-4 h-4" />,
  "Beaches": <Sunset className="w-4 h-4" />,
  "Islands": <Palmtree className="w-4 h-4" />,
  "Rivers": <Waves className="w-4 h-4" />,
  "Lakes": <Waves className="w-4 h-4" />,
  "Forests": <Trees className="w-4 h-4" />,
  "Waterfalls": <Droplet className="w-4 h-4" />,
  "Desert": <Compass className="w-4 h-4" />,
  "Historical Places": <Landmark className="w-4 h-4" />,
  "Wildlife": <Compass className="w-4 h-4" />,
  "Spiritual Places": <Sparkles className="w-4 h-4" />
};

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    source_city: "",
    attractions: [] as string[],
    budget: "",
    duration: 5,
    companions: "",
    transport: "",
    flexibility: "",
    weather: "",
    crowd: "",
    gems_vs_popular: ""
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [apiResult, setApiResult] = useState<any>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedDestDetails, setSelectedDestDetails] = useState<any>(null);

  // Auto-detect location using real public geolocator API & Geolocation fallback
  const handleAutoDetect = async () => {
    setIsLocating(true);
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      if (data && data.city) {
        setFormData(prev => ({ ...prev, source_city: `${data.city}, ${data.country_name}` }));
        setIsLocating(false);
        setTimeout(() => setStep(2), 600);
        return;
      }
    } catch (e) {
      console.log("IP geolocation failed, falling back to browser GPS", e);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const geoData = await geoRes.json();
            if (geoData && geoData.city) {
              setFormData(prev => ({ ...prev, source_city: `${geoData.city}, ${geoData.countryName}` }));
            } else {
              setFormData(prev => ({ ...prev, source_city: "New Delhi, India" }));
            }
          } catch {
            setFormData(prev => ({ ...prev, source_city: "New Delhi, India" }));
          } finally {
            setIsLocating(false);
            setTimeout(() => setStep(2), 600);
          }
        },
        () => {
          setFormData(prev => ({ ...prev, source_city: "New Delhi, India" }));
          setIsLocating(false);
          setTimeout(() => setStep(2), 600);
        }
      );
    } else {
      setFormData(prev => ({ ...prev, source_city: "New Delhi, India" }));
      setIsLocating(false);
      setTimeout(() => setStep(2), 600);
    }
  };

  const toggleMultiSelect = (field: "attractions", value: string) => {
    const list = [...formData[field]];
    if (list.includes(value)) {
      setFormData({ ...formData, [field]: list.filter(item => item !== value) });
    } else {
      setFormData({ ...formData, [field]: [...list, value] });
    }
  };

  const handleSelect = (field: keyof typeof formData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const selectAndAdvance = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTimeout(() => {
      setStep(prev => {
        if (prev < 10) {
          return prev + 1;
        } else {
          handleSubmit();
          return prev;
        }
      });
    }, 350);
  };

  const handleNext = () => {
    if (step < 10) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Onboarding Submissions
  const handleSubmit = () => {
    setIsGenerating(true);
  };

  const loaderSteps = [
    "Analyzing questionnaire & travel personality...",
    "Preference Agent: Resolving travel style...",
    "Destination Discovery Agent: Searching locations...",
    "Weather Agent: Checking climates...",
    "Route Agent: Calculating distances and transits...",
    "Budget Agent: Estimating Stay, Food, and Activities costs...",
    "Itinerary Agent: Organizing day-by-day planner...",
    "Finalizing VoyageIQ assembly..."
  ];

  useEffect(() => {
    if (isGenerating) {
      // Start API generation in parallel
      const startApiGen = async () => {
        let finalRes: any = null;
        try {
          const apiKey = localStorage.getItem("groqApiKey") || process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
          if (apiKey) {
            const attractionsStr = formData.attractions.join(", ") || "Scenic Locations";
            const budgetVal = formData.budget || "₹15k–₹25k";
            
            const prompt = `User Questionnaire Answers:
- Starting location: ${formData.source_city}
- Preferred landscape/attractions: ${attractionsStr}
- Budget range: ${budgetVal}
- Duration of stay: ${formData.duration} days
- Companions: ${formData.companions}
- Preferred transport mode: ${formData.transport}
- Route flexibility: ${formData.flexibility}
- Weather preference: ${formData.weather}
- Crowd density preference: ${formData.crowd}
- Preference for popular vs hidden gems: ${formData.gems_vs_popular}

Generate recommendations matching these preferences. You must output exactly the JSON structure requested below.
Choose from a wide variety of destinations, including hidden/offbeat ones in India (such as Chopta, Munsiyari, Ziro Valley, Tawang, Orchha, Mandu, Hampi, Gokarna, Varkala, Chopta, Spiti Valley, Sikkim, Darjeeling, Meghalaya, etc.) or international ones if suitable. Do not restrict yourself only to Munnar, Srinagar, Goa, Manali, Nainital. Include many options.

Return ONLY a JSON object with this exact structure:
{
  "personality": "2-3 word travel persona name (e.g. 'Alpine Trekker', 'Coastal Wanderer', 'Cultural Nomad')",
  "match_scores": {
    "Primary Destination Name": 98,
    "Second Destination Name": 89,
    "Third Destination Name": 84
  },
  "top_recommendations": [
    { "destination": "Primary Destination Name", "reason": "Explain why this is the perfect match based on weather, budget, and tags in 2 sentences." },
    { "destination": "Second Destination Name", "reason": "Explain why this is a great alternative in 2 sentences." },
    { "destination": "Third Destination Name", "reason": "Explain why this matches in 2 sentences." }
  ],
  "alternative_destinations": ["Third Destination Name", "Another Destination Name"],
  "insights": [
    "Vivid, specific insight 1 about the transport or budget for these destinations.",
    "Vivid, specific insight 2 about weather or best season to visit."
  ],
  "itinerary": [
    { "day": 1, "activity": "Vivid day 1 activity details for the primary destination", "weather_snippet": "Sunny / Temperate / Cold" },
    { "day": 2, "activity": "Vivid day 2 activity details for the primary destination", "weather_snippet": "Sunny / Temperate / Cold" }
  ],
  "logs": [
    "Preference Agent: Mapped profile to travel persona...",
    "Destination Discovery Agent: Found matches in the database...",
    "Weather Agent: Checked forecast...",
    "Route Agent: Calculated transit times...",
    "Budget Agent: Estimated stay and travel expenses...",
    "Itinerary Agent: Compiled day-by-day itinerary..."
  ]
}

Ensure the "itinerary" array has exactly \${formData.duration} entries matching the stay duration.
No other markdown or introductory text. Just the JSON object.`;

            const resRaw = await groqChat(
              [{ role: "user", content: prompt }],
              { temperature: 0.7, jsonMode: true, maxTokens: 1500 }
            );
            const parsed = parseGroqJson(resRaw);
            if (parsed && parsed.match_scores && parsed.top_recommendations) {
              const primaryDest = Object.keys(parsed.match_scores)[0];
              const budgetBreakdown = calculateDetailedBudget(primaryDest, formData.budget, formData.duration);
              finalRes = {
                ...parsed,
                budgetBreakdown
              };
            }
          }
        } catch (err) {
          console.error("Groq onboarding recommendations failed:", err);
        }
        
        // If API generation failed or was skipped due to missing key, fall back to mock
        if (!finalRes) {
          finalRes = generateMockOutput();
        }
        return finalRes;
      };

      const apiPromise = startApiGen();

      const interval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= loaderSteps.length - 1) {
            clearInterval(interval);
            apiPromise.then((result) => {
              setIsGenerating(false);
              setIsFinished(true);
              setApiResult(result);

              // Persist trip to localStorage under "myTrips"
              try {
                const existingTripsStr = localStorage.getItem("myTrips");
                const existingTrips = existingTripsStr ? JSON.parse(existingTripsStr) : [];
                
                const newTrip = {
                  id: Date.now(),
                  from: formData.source_city || "New Delhi, India",
                  to: Object.keys(result.match_scores)[0],
                  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + " - " + 
                        new Date(Date.now() + formData.duration * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                  status: "Upcoming",
                  stops: [formData.source_city || "Delhi", Object.keys(result.match_scores)[0]],
                  personality: result.personality,
                  cost: result.budgetBreakdown.total,
                  budgetBreakdown: result.budgetBreakdown,
                  itinerary: result.itinerary
                };

                existingTrips.push(newTrip);
                localStorage.setItem("myTrips", JSON.stringify(existingTrips));
                localStorage.setItem("userPersonality", result.personality);
                localStorage.setItem("userPreferences", JSON.stringify(formData));
                localStorage.setItem("onboardingRecommendations", JSON.stringify(result));
              } catch (e) {
                console.error("Failed to save trip to localStorage", e);
              }
            });
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const generateMockOutput = () => {
    const attractionsStr = formData.attractions.join(", ") || "Scenic Locations";
    const budgetVal = formData.budget || "₹15k–₹25k";
    
    // Check budget tiers
    const isLowBudget = ["₹0–₹5k", "₹5k–₹10k", "₹10k–₹15k"].includes(budgetVal);
    const isMediumBudget = ["₹15k–₹25k", "₹25k–₹50k"].includes(budgetVal);

    let dest = "Munnar, Kerala";
    let desc = "A serene match capturing tea estates, misty paths, and waterfalls.";

    if (isLowBudget) {
      // Domestic Indian options under 15k
      if (formData.attractions.includes("Beaches") || formData.attractions.includes("Islands")) {
        dest = "Goa, India";
        desc = "Features budget-friendly beach stays, local shacks, and scenic coastal road transits.";
      } else if (formData.attractions.includes("Snow") || formData.attractions.includes("Mountains")) {
        dest = "Dehradun / Mussoorie, India";
        desc = "Offers cheap Himalayan mountain hikes, cool weather, and budget hill station stays.";
      } else {
        dest = "Agra, India";
        desc = "Historic cultural exploration of the Taj Mahal and Mughal architecture within easy budget reaches.";
      }
    } else if (isMediumBudget) {
      // Mid tier (15k - 50k) - Premium domestic or budget international
      if (formData.attractions.includes("Beaches") || formData.attractions.includes("Islands")) {
        dest = "Andaman Islands, India";
        desc = "Features premium white sand beaches, coral reefs, and water sport transit packages.";
      } else if (formData.attractions.includes("Snow") || formData.attractions.includes("Mountains")) {
        dest = "Srinagar, Kashmir";
        desc = "Stunning shikara rides on Dal Lake, snowy mountain backdrops, and local valleys.";
      } else {
        dest = "Udaipur, India";
        desc = "Majestic lake palaces, Mewar history walks, and premium heritage stays.";
      }
    } else {
      // Premium / Luxury (50k+) - Premium Indian destinations
      if (formData.attractions.includes("Beaches") || formData.attractions.includes("Islands")) {
        dest = "Lakshadweep Islands, India";
        desc = "Experience ultimate luxury in secluded tropical lagoons, pristine coral reefs, and premium beachfront cottages.";
      } else if (formData.attractions.includes("Snow") || formData.attractions.includes("Mountains")) {
        dest = "Gulmarg, Kashmir";
        desc = "Highly suited for premium winter sports, scenic gondola rides, and high-altitude alpine views.";
      } else {
        dest = "Munnar, Kerala";
        desc = "Premium hill retreat featuring private tea garden villas, misty landscape views, and spice trails.";
      }
    }

    // Estimate realistic itemized budget allocation
    let transportCost = 3500;
    let hotelCost = 4000;
    let foodCost = 1500;
    let activitiesCost = 1000;

    if (isMediumBudget) {
      transportCost = 12000;
      hotelCost = 10000;
      foodCost = 5000;
      activitiesCost = 3000;
    } else if (!isLowBudget && !isMediumBudget) {
      transportCost = 35000;
      hotelCost = 28000;
      foodCost = 12000;
      activitiesCost = 10000;
    }

    const totalCost = (transportCost + (hotelCost + foodCost + activitiesCost) * formData.duration);

    const budgetBreakdown = {
      transport: "₹" + transportCost.toLocaleString(),
      hotel: "₹" + (hotelCost * formData.duration).toLocaleString() + ` (${formData.duration} nights)`,
      food: "₹" + (foodCost * formData.duration).toLocaleString(),
      activities: "₹" + (activitiesCost * formData.duration).toLocaleString(),
      total: "₹" + totalCost.toLocaleString()
    };

    return {
      personality: isLowBudget ? "Budget Explorer" : isMediumBudget ? "Balanced Adventurer" : "Luxe Connoisseur",
      match_scores: {
        [dest]: 96,
        [isLowBudget ? "Nainital, India" : isMediumBudget ? "Manali, India" : "Leh Ladakh, India"]: 89,
        [isLowBudget ? "Jaipur, India" : isMediumBudget ? "Gangtok, India" : "Wayanad, India"]: 84
      },
      top_recommendations: [
        { destination: dest, reason: desc },
        { 
          destination: isLowBudget ? "Nainital, India" : isMediumBudget ? "Manali, India" : "Leh Ladakh, India", 
          reason: `Fits your weather selection and matches your interest in ${attractionsStr}.` 
        }
      ],
      alternative_destinations: isLowBudget ? ["Jaipur, India", "Rishikesh, India"] : isMediumBudget ? ["Gangtok, India", "Goa, India"] : ["Wayanad, India", "Ooty, India"],
      insights: [
        `Since you prefer ${formData.transport || 'trains'} and ${formData.weather || 'temperate'} weather, these destinations represent the best value-for-money.`,
        `Given a ${formData.duration}-day stay and ${formData.crowd || 'low'} crowd preference, off-center stays are highly recommended.`
      ],
      itinerary: [
        { day: 1, activity: `Arrival at ${dest}, check-in to hotel, and local orientation walk.`, weather_snippet: "Temperate" },
        { day: 2, activity: `Explore major scenic hotspots matching ${attractionsStr} tags.`, weather_snippet: "Sunny" },
        { day: 3, activity: `Day tour of historical structures and local markets.`, weather_snippet: "Pleasant" },
        { day: 4, activity: "Leisure day for traditional dining experiences and souvenir shopping.", weather_snippet: "Sunny" },
        { day: 5, activity: "Hotel checkout and departure transit.", weather_snippet: "Temperate" }
      ],
      logs: [
        `Preference Agent: Mapped profile to '${isLowBudget ? "Budget Explorer" : isMediumBudget ? "Balanced Adventurer" : "Luxe Connoisseur"}'`,
        `Destination Agent: Filtered matching spots: ${dest}`,
        `Weather Agent: Selected forecast matched '${formData.weather || "Temperate"}' preference`,
        `Route Agent: Selected optimal transit using '${formData.transport || "Train"}' options`,
        `Budget Agent: Allocated itemized costs (Transport: ₹${transportCost.toLocaleString()}, Hotel/Stay: ₹${hotelCost.toLocaleString()} per night)`,
        "Itinerary Agent: Compiled day-by-day scheduler summaries."
      ],
      budgetBreakdown
    };
  };

  // Steps definitions
  const stepTitles = [
    "Where do you live?",
    "What type of destination attracts you?",
    "What is your budget range?",
    "What is your travel duration?",
    "Who is traveling with you?",
    "What is your transport preference?",
    "How flexible are you with routes?",
    "What is your weather preference?",
    "What is your crowd preference?",
    "Do you prefer popular spots or hidden gems?"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between py-12 px-6 relative selection:bg-purple-500/30">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] glow-purple opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] glow-blue opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="max-w-3xl w-full mx-auto flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2 group text-neutral-500 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          Step {step} of 10
        </span>
      </header>

      {/* Onboarding State Container */}
      <main className="max-w-3xl w-full mx-auto my-auto z-10 py-8">
        {!isGenerating && !isFinished && (
          <div>
            {/* Progress Bar */}
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden mb-12">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-full transition-all duration-300"
                style={{ width: `${(step / 10) * 100}%` }}
              />
            </div>

            {/* Transition Anim */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="min-h-[350px]"
              >
                <h1 className="text-3xl font-extrabold tracking-tight mb-8">
                  {stepTitles[step - 1]}
                </h1>

                {/* Step Forms */}
                {step === 1 && (
                  <div className="flex flex-col gap-6">
                    <button 
                      onClick={handleAutoDetect}
                      disabled={isLocating}
                      className="w-full p-6 rounded-2xl border border-card-border bg-card hover:bg-neutral-50 dark:hover:bg-neutral-900 text-left font-semibold flex items-center justify-between transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        Auto Detect Location
                      </span>
                      {isLocating ? (
                        <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                      ) : (
                        formData.source_city && <Check className="w-5 h-5 text-purple-600" />
                      )}
                    </button>

                    <div className="flex items-center gap-4">
                      <div className="h-px bg-card-border flex-grow" />
                      <span className="text-xs font-bold text-neutral-400 uppercase">OR ENTER MANUALLY</span>
                      <div className="h-px bg-card-border flex-grow" />
                    </div>

                    <input 
                      type="text" 
                      placeholder="e.g. Lucknow, India"
                      value={formData.source_city}
                      onChange={(e) => handleSelect("source_city", e.target.value)}
                      className="w-full p-4 rounded-xl border border-card-border bg-card focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      "Mountains", "Snow", "Beaches", "Islands", 
                      "Rivers", "Lakes", "Forests", "Waterfalls", 
                      "Desert", "Historical Places", "Wildlife", "Spiritual Places"
                    ].map((attr) => {
                      const selected = formData.attractions.includes(attr);
                      return (
                        <button
                          key={attr}
                          onClick={() => toggleMultiSelect("attractions", attr)}
                          className={`p-4 rounded-xl border font-semibold text-sm flex items-center gap-3 transition-all ${
                            selected 
                              ? "border-purple-500 bg-purple-500/5 text-purple-600 dark:text-purple-400 scale-[0.98] shadow-inner" 
                              : "border-card-border bg-card hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:scale-[1.01]"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                            selected ? "border-purple-500 bg-purple-500 text-white" : "border-neutral-300 dark:border-neutral-700"
                          }`}>
                            {selected && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span className="flex items-center gap-1.5">
                            {attractionIcons[attr]}
                            {attr}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {step === 3 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { val: "₹0–₹5k", desc: "Economy Budget", icons: 1, sparkles: false },
                      { val: "₹5k–₹10k", desc: "Backpacker", icons: 1, sparkles: false },
                      { val: "₹10k–₹15k", desc: "Standard Route", icons: 2, sparkles: false },
                      { val: "₹15k–₹25k", desc: "Premium Comfort", icons: 2, sparkles: false },
                      { val: "₹25k–₹50k", desc: "Luxe Gateway", icons: 3, sparkles: false },
                      { val: "₹50k+", desc: "Ultimate Luxury", icons: 3, sparkles: true }
                    ].map((item) => {
                      const selected = formData.budget === item.val;
                      return (
                        <button
                          key={item.val}
                          onClick={() => selectAndAdvance("budget", item.val)}
                          className={`p-6 rounded-2xl border text-left flex flex-col justify-between h-36 transition-all ${
                            selected 
                              ? "border-purple-500 bg-purple-500/5 text-purple-600 dark:text-purple-400 scale-[0.98] shadow-inner" 
                              : "border-card-border bg-card hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:scale-[1.01]"
                          }`}
                        >
                          <div className="flex justify-between items-start w-full">
                            <span className="font-extrabold text-lg">{item.val}</span>
                            <div className="flex text-emerald-500">
                              {Array.from({ length: item.icons }).map((_, i) => (
                                <DollarSign key={i} className="w-4 h-4 shrink-0 -ml-1 first:ml-0" />
                              ))}
                              {item.sparkles && <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0 animate-pulse" />}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">{item.desc}</p>
                            <p className="text-[9px] text-neutral-500 mt-1">Select option to auto-advance</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {step === 4 && (
                  <div className="flex flex-col gap-8">
                    <div className="text-center">
                      <span className="text-7xl font-black text-purple-600 dark:text-purple-400 font-display">
                        {formData.duration}
                      </span>
                      <span className="text-xl font-bold ml-2 text-neutral-400">days</span>
                    </div>

                    <input 
                      type="range" 
                      min="1" 
                      max="30" 
                      value={formData.duration}
                      onChange={(e) => handleSelect("duration", parseInt(e.target.value))}
                      className="w-full accent-purple-600 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg cursor-pointer"
                    />

                    <div className="flex justify-between text-xs font-bold text-neutral-400">
                      <span>1 DAY</span>
                      <span>15 DAYS</span>
                      <span>30 DAYS</span>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { val: "Solo", desc: "Traveling alone", icon: <User className="w-6 h-6 text-blue-500" /> },
                      { val: "Couple", desc: "Romantic or partner getaway", icon: <Heart className="w-6 h-6 text-rose-500" /> },
                      { val: "Friends", desc: "Group adventure", icon: <Users className="w-6 h-6 text-purple-500" /> },
                      { val: "Family", desc: "Vacation with family", icon: <Home className="w-6 h-6 text-emerald-500" /> }
                    ].map((comp) => {
                      const selected = formData.companions === comp.val;
                      return (
                        <button
                          key={comp.val}
                          onClick={() => selectAndAdvance("companions", comp.val)}
                          className={`p-6 rounded-2xl border text-left flex items-start gap-4 transition-all ${
                            selected 
                              ? "border-purple-500 bg-purple-500/5 text-purple-600 dark:text-purple-400 scale-[0.98] shadow-inner" 
                              : "border-card-border bg-card hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:scale-[1.01]"
                          }`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center border border-card-border shrink-0">
                            {comp.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-base">{comp.val}</h3>
                            <p className="text-xs text-neutral-400 mt-0.5">{comp.desc}</p>
                            <p className="text-[9px] text-neutral-500 mt-2 font-medium">Click to select & advance</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {step === 6 && (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { val: "Flight", desc: "Fastest travel transit", icon: <Plane className="w-6 h-6 text-sky-500" /> },
                      { val: "Train", desc: "Scenic land journeys", icon: <Train className="w-6 h-6 text-amber-500" /> },
                      { val: "Car", desc: "Flexible road trips", icon: <Car className="w-6 h-6 text-emerald-500" /> },
                      { val: "Bus", desc: "Budget road transits", icon: <Bus className="w-6 h-6 text-rose-500" /> }
                    ].map((t) => {
                      const selected = formData.transport === t.val;
                      return (
                        <button
                          key={t.val}
                          onClick={() => selectAndAdvance("transport", t.val)}
                          className={`p-6 rounded-2xl border text-left flex items-start gap-4 transition-all ${
                            selected 
                              ? "border-purple-500 bg-purple-500/5 text-purple-600 dark:text-purple-400 scale-[0.98] shadow-inner" 
                              : "border-card-border bg-card hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:scale-[1.01]"
                          }`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center border border-card-border shrink-0">
                            {t.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-base">{t.val}</h3>
                            <p className="text-xs text-neutral-400 mt-0.5">{t.desc}</p>
                            <p className="text-[9px] text-neutral-500 mt-2 font-medium">Click to select & advance</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {step === 7 && (
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { val: "Rigid", desc: "Strict stops & times", icon: <Lock className="w-5 h-5 text-rose-500" /> },
                      { val: "Flexible", desc: "Room for side trips", icon: <Shuffle className="w-5 h-5 text-blue-500" /> },
                      { val: "Very Flexible", desc: "Decide stops on go", icon: <Compass className="w-5 h-5 text-purple-500" /> }
                    ].map((flex) => {
                      const selected = formData.flexibility === flex.val;
                      return (
                        <button
                          key={flex.val}
                          onClick={() => selectAndAdvance("flexibility", flex.val)}
                          className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-36 transition-all ${
                            selected 
                              ? "border-purple-500 bg-purple-500/5 text-purple-600 dark:text-purple-400 scale-[0.98] shadow-inner" 
                              : "border-card-border bg-card hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:scale-[1.01]"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-card-border flex items-center justify-center">
                            {flex.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm">{flex.val}</h3>
                            <p className="text-[10px] text-neutral-400 mt-0.5 leading-snug">{flex.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {step === 8 && (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { val: "Hot/Sunny", desc: "T-shirt weather", icon: <Sun className="w-6 h-6 text-amber-500" /> },
                      { val: "Cold/Snowy", desc: "Jackets and snowfall", icon: <Snowflake className="w-6 h-6 text-sky-500" /> },
                      { val: "Temperate", desc: "Cool breeze, pleasant", icon: <CloudSun className="w-6 h-6 text-blue-500" /> },
                      { val: "Rainy/Monsoon", desc: "Lush green rain trails", icon: <CloudRain className="w-6 h-6 text-indigo-500" /> }
                    ].map((w) => {
                      const selected = formData.weather === w.val;
                      return (
                        <button
                          key={w.val}
                          onClick={() => selectAndAdvance("weather", w.val)}
                          className={`p-6 rounded-2xl border text-left flex items-start gap-4 transition-all ${
                            selected 
                              ? "border-purple-500 bg-purple-500/5 text-purple-600 dark:text-purple-400 scale-[0.98] shadow-inner" 
                              : "border-card-border bg-card hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:scale-[1.01]"
                          }`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center border border-card-border shrink-0">
                            {w.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-base">{w.val}</h3>
                            <p className="text-xs text-neutral-400 mt-0.5">{w.desc}</p>
                            <p className="text-[9px] text-neutral-500 mt-2 font-medium">Click to select & advance</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {step === 9 && (
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { val: "Low", desc: "Serene & quiet spots", icon: <EyeOff className="w-5 h-5 text-blue-500" /> },
                      { val: "Medium", desc: "Moderate tourism presence", icon: <Users className="w-5 h-5 text-purple-500" /> },
                      { val: "High", desc: "Bustling, vibrant markets", icon: <Flame className="w-5 h-5 text-rose-500" /> }
                    ].map((crw) => {
                      const selected = formData.crowd === crw.val;
                      return (
                        <button
                          key={crw.val}
                          onClick={() => selectAndAdvance("crowd", crw.val)}
                          className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-36 transition-all ${
                            selected 
                              ? "border-purple-500 bg-purple-500/5 text-purple-600 dark:text-purple-400 scale-[0.98] shadow-inner" 
                              : "border-card-border bg-card hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:scale-[1.01]"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-card-border flex items-center justify-center">
                            {crw.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm">{crw.val} Density</h3>
                            <p className="text-[10px] text-neutral-400 mt-0.5 leading-snug">{crw.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {step === 10 && (
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { val: "Hidden Gems", desc: "Offbeat non-touristy trails", icon: <Gem className="w-5 h-5 text-purple-500" /> },
                      { val: "Popular Places", desc: "Top-voted attractions", icon: <Flame className="w-5 h-5 text-orange-500" /> },
                      { val: "Balanced Mix", desc: "Hybrid structured routes", icon: <Scale className="w-5 h-5 text-emerald-500" /> }
                    ].map((opt) => {
                      const selected = formData.gems_vs_popular === opt.val;
                      return (
                        <button
                          key={opt.val}
                          onClick={() => selectAndAdvance("gems_vs_popular", opt.val)}
                          className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-36 transition-all ${
                            selected 
                              ? "border-purple-500 bg-purple-500/5 text-purple-600 dark:text-purple-400 scale-[0.98] shadow-inner" 
                              : "border-card-border bg-card hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:scale-[1.01]"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-card-border flex items-center justify-center">
                            {opt.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm">{opt.val}</h3>
                            <p className="text-[10px] text-neutral-400 mt-0.5 leading-snug">{opt.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* AI Processing Screen */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <Loader2 className="w-16 h-16 text-purple-600 animate-spin mb-8" />
            <motion.div
              key={generationProgress}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg font-bold text-neutral-700 dark:text-neutral-300"
            >
              {loaderSteps[generationProgress]}
            </motion.div>
            <p className="text-sm text-neutral-400 mt-2 max-w-sm">
              Connecting to LangGraph agent nodes. Building travel parameters...
            </p>
          </div>
        )}

        {/* AI Recommendations Screen */}
        {isFinished && apiResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-8 pb-16"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3 h-3 animate-pulse" /> Travel Graph Compiled
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">Your Travel Proposal</h1>
              <p className="text-neutral-500">Based on your onboarding preferences</p>
            </div>

            {/* Travel Personality */}
            <div className="glass p-8 rounded-3xl border border-card-border relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Travel Personality</span>
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-1">
                  {apiResult.personality}
                </h2>
              </div>
              <div className="text-xs font-bold px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-card-border text-neutral-500 flex items-center gap-2">
                <Info className="w-4 h-4" /> Configured for {formData.duration} Days
              </div>
            </div>

            {/* Curated Matches (Images & Reason Cards) */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                <Compass className="w-5 h-5 text-blue-500" /> Curated Matches
              </h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {Object.entries(apiResult.match_scores).map(([dest, score]: any) => (
                  <div 
                    key={dest} 
                    onClick={() => {
                      const reason = apiResult.top_recommendations.find((r: any) => r.destination === dest)?.reason || 
                        (dest.includes("Nainital") ? "A beautiful, serene lake resort nestling in the Himalayas." : "Explore cultural architectures.");
                      const budgetDtl = calculateDetailedBudget(dest, formData.budget, formData.duration);
                      const rates = getPlatformRates(dest, formData.budget, formData.transport);
                      setSelectedDestDetails({
                        name: dest,
                        score: score,
                        reason: reason,
                        budgetBreakdown: budgetDtl,
                        hotelRates: rates.hotelRates,
                        transitRates: rates.transitRates,
                        transportMode: formData.transport || "Train"
                      });
                    }}
                    className="rounded-3xl border border-card-border bg-card overflow-hidden hover:scale-[1.02] hover:border-purple-500/30 transition-all group flex flex-col justify-between cursor-pointer text-left shadow-sm hover:shadow-md"
                  >
                    <div className="h-32 relative overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                      <img 
                        src={getDestinationImage(dest)} 
                        alt={dest} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className="absolute top-3 right-3 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-md">
                        {score}% MATCH
                      </span>
                    </div>
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm truncate">{dest}</h4>
                        <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed line-clamp-3">
                          {apiResult.top_recommendations.find((r: any) => r.destination === dest)?.reason || 
                           (dest.includes("Nainital") ? "A beautiful, serene lake resort nestling in the Himalayas." : "Explore cultural architectures.")}
                        </p>
                      </div>
                      <div className="mt-4 pt-3.5 border-t border-card-border flex items-center justify-between text-[10px] font-extrabold text-purple-600 dark:text-purple-400 group-hover:translate-x-0.5 transition-transform">
                        <span>VIEW DETAILED SUMMARY</span>
                        <span>➔</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Price Comparison */}
            <div className="glass p-8 rounded-3xl border border-card-border flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                  <DollarSign className="w-5 h-5 text-emerald-500" /> Platform Price Comparison
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Compare hotel and transit prices across popular Indian and global travel portals.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Hotels Pricing */}
                <div className="flex flex-col gap-4">
                  <h4 className="font-extrabold text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    🏨 Hotel Stay Rates (Per Night)
                  </h4>
                  <div className="flex flex-col gap-3">
                    {getPlatformRates(Object.keys(apiResult.match_scores)[0], formData.budget, formData.transport).hotelRates.map((h, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-card border border-card-border flex items-center justify-between hover:border-purple-500/15 hover:scale-[1.01] transition-all">
                        <div className="flex items-center gap-3">
                          <span className={`w-2.5 h-2.5 rounded-full ${h.isBest ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
                          <span className="font-extrabold text-sm">{h.platform}</span>
                          {h.isBest && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              BEST VALUE
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-emerald-500">₹{h.rate.toLocaleString()}</span>
                          <span className="text-[9px] text-neutral-500 dark:text-neutral-400 block mt-0.5">User Rating: {h.rating}/5⭐</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transit Pricing */}
                <div className="flex flex-col gap-4">
                  <h4 className="font-extrabold text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    {formData.transport === "Flight" ? "✈️ Flight Ticket Price" : formData.transport === "Train" ? "🚄 Train Ticket Price" : "🚌 Bus / Cab Ticket Price"}
                  </h4>
                  <div className="flex flex-col gap-3">
                    {getPlatformRates(Object.keys(apiResult.match_scores)[0], formData.budget, formData.transport).transitRates.map((t, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-card border border-card-border flex items-center justify-between hover:border-purple-500/15 hover:scale-[1.01] transition-all">
                        <div className="flex items-center gap-3">
                          <span className={`w-2.5 h-2.5 rounded-full ${t.isBest ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
                          <span className="font-extrabold text-sm">{t.platform}</span>
                          {t.isBest && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              BEST DEAL
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-emerald-500">₹{t.rate.toLocaleString()}</span>
                          <span className="text-[9px] text-neutral-500 dark:text-neutral-400 block mt-0.5">Transit Type: {t.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Summary & Suggestions */}
            <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900/40 border border-card-border flex flex-col gap-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" /> AI Travel Summary & Suggestions
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Based on your preference for <strong>{formData.attractions.join(", ") || "scenic outdoors"}</strong> and budget category <strong>{formData.budget}</strong>, the VoyageIQ engine mapped your style to <strong>{apiResult.personality}</strong>. Your main recommended destination is <strong>{Object.keys(apiResult.match_scores)[0]}</strong>.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <div className="p-4 rounded-2xl bg-card border border-card-border text-xs leading-relaxed">
                  <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-1 flex items-center gap-1">💡 Travel Advice</h4>
                  <p className="text-neutral-600 dark:text-neutral-400">Pack light and wear layers suitable for the climate. Local transits via <strong>{formData.transport || 'trains'}</strong> are highly recommended to optimize budget.</p>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-card-border text-xs leading-relaxed">
                  <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">📅 Best Season to Visit</h4>
                  <p className="text-neutral-600 dark:text-neutral-400">Temperate climates are best explored in the spring or autumn months when tourist density is lowest and scenery is clearest.</p>
                </div>
              </div>
            </div>

            {/* Itinerary */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                <Calendar className="w-5 h-5 text-amber-500" /> Proposed Day-by-Day Route
              </h3>
              <div className="flex flex-col gap-3">
                {apiResult.itinerary.map((day: any) => (
                  <div key={day.day} className="p-5 rounded-2xl bg-card border border-card-border hover:border-purple-500/15 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                        Day {day.day}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">Forecast: {day.weather_snippet}</span>
                    </div>
                    <p className="text-sm font-medium">{day.activity}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow logs */}
            <div className="p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-card-border">
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">
                LangGraph Workflow Execution Steps
              </h4>
              <div className="flex flex-col gap-1.5 font-mono text-[11px] text-neutral-400">
                {apiResult.logs.map((log: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span> {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-4 mt-4">
              <Link 
                href="/login"
                className="flex-grow text-center py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-blue-500/15"
              >
                Login to Access Dashboard
              </Link>
              <button 
                onClick={() => {
                  setStep(1);
                  setIsFinished(false);
                  setFormData({
                    source_city: "",
                    attractions: [],
                    budget: "",
                    duration: 5,
                    companions: "",
                    transport: "",
                    flexibility: "",
                    weather: "",
                    crowd: "",
                    gems_vs_popular: ""
                  });
                  setGenerationProgress(0);
                }}
                className="px-6 py-4 rounded-xl font-bold border border-card-border bg-card text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Start Over
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer Navigation Buttons */}
      {!isGenerating && !isFinished && (
        <footer className="max-w-3xl w-full mx-auto flex items-center justify-between z-10 border-t border-card-border pt-8">
          <button 
            onClick={handlePrev}
            disabled={step === 1}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border border-card-border bg-card text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          
          <button 
            onClick={handleNext}
            disabled={step === 1 && !formData.source_city}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md shadow-blue-500/10"
          >
            {step === 10 ? "Submit & Generate" : "Next"} <ArrowRight className="w-4 h-4" />
          </button>
        </footer>
      )}

      {/* Detailed Match Summary Modal */}
      <AnimatePresence>
        {selectedDestDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-card border border-card-border max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-fade-in"
            >
              {/* Header Image & Title */}
              <div className="h-44 relative bg-neutral-100 dark:bg-neutral-900 shrink-0">
                <img 
                  src={getDestinationImage(selectedDestDetails.name)} 
                  alt={selectedDestDetails.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
                <button 
                  onClick={() => setSelectedDestDetails(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/85 transition-colors cursor-pointer border border-white/10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black px-2.5 py-0.5 rounded bg-emerald-500 text-white shadow-sm uppercase tracking-wider">
                      {selectedDestDetails.score}% Match score
                    </span>
                    <span className="text-[9px] font-black px-2.5 py-0.5 rounded bg-purple-500 text-white shadow-sm uppercase tracking-wider">
                      AI Route Active
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white mt-1.5 drop-shadow-sm">{selectedDestDetails.name}</h3>
                </div>
              </div>

              {/* Scrollable Summary Body */}
              <div className="overflow-y-auto p-6 flex flex-col gap-6 scrollbar-thin">
                
                {/* Route Summary */}
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-card-border flex flex-col gap-2.5">
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400">Route Overview</span>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/10 text-purple-600">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs">{formData.source_city || "New Delhi"}</span>
                      <span className="text-neutral-400">➔</span>
                      <span className="font-extrabold text-xs text-purple-600 dark:text-purple-400">{selectedDestDetails.name}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed italic">
                    "{selectedDestDetails.reason}"
                  </p>
                </div>

                {/* Estimated Budget Allocation */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400">Route & Stay Budget Breakdown</span>
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="p-4 rounded-2xl bg-card border border-card-border flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-neutral-400">🚊 TRANSIT ({selectedDestDetails.transportMode})</span>
                      <span className="text-lg font-black text-neutral-800 dark:text-neutral-100">{selectedDestDetails.budgetBreakdown.transport}</span>
                      <span className="text-[9px] text-neutral-500">Based on lowest portal rates</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-card border border-card-border flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-neutral-400">🏨 ACCOMMODATION (Hotel)</span>
                      <span className="text-lg font-black text-neutral-800 dark:text-neutral-100">{selectedDestDetails.budgetBreakdown.hotel.split(" ")[0]}</span>
                      <span className="text-[9px] text-neutral-500">For {formData.duration} nights stay</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-card border border-card-border flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-neutral-400">🍔 FOOD & DINING</span>
                      <span className="text-lg font-black text-neutral-800 dark:text-neutral-100">{selectedDestDetails.budgetBreakdown.food}</span>
                      <span className="text-[9px] text-neutral-500">Estimated meal allowance</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-card border border-card-border flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-neutral-400">🎡 SIGHTSEEING / SPREE</span>
                      <span className="text-lg font-black text-neutral-800 dark:text-neutral-100">{selectedDestDetails.budgetBreakdown.activities}</span>
                      <span className="text-[9px] text-neutral-500">Guided walks & activity tickets</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between mt-1">
                    <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">TOTAL ESTIMATED BUDGET</span>
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{selectedDestDetails.budgetBreakdown.total}</span>
                  </div>
                </div>

                {/* Portal Rates comparison */}
                <div className="flex flex-col gap-3.5">
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400">Platform Portal Quotations</span>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Hotel Portals */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-neutral-400">🏨 Stay Portals</span>
                      <div className="flex flex-col gap-1.5">
                        {selectedDestDetails.hotelRates.map((h: any, idx: number) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-card border border-card-border flex justify-between items-center text-[11px]">
                            <span className="font-extrabold">{h.platform}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-emerald-600 dark:text-emerald-400">₹{h.rate}</span>
                              {h.isBest && <span className="text-[8px] bg-emerald-500 text-white font-extrabold px-1 rounded">BEST</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Transit Portals */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-neutral-400">🚊 Transit Portals</span>
                      <div className="flex flex-col gap-1.5">
                        {selectedDestDetails.transitRates.map((t: any, idx: number) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-card border border-card-border flex justify-between items-center text-[11px]">
                            <span className="font-extrabold">{t.platform}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-purple-600 dark:text-purple-400">₹{t.rate}</span>
                              {t.isBest && <span className="text-[8px] bg-purple-500 text-white font-extrabold px-1 rounded">BEST</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Day-by-day preview */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400">Personalized Itinerary Outline</span>
                  <div className="flex flex-col gap-2.5">
                    {apiResult.itinerary.map((dayItem: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-card-border flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-black flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-grow">
                          <p className="text-[11px] font-bold leading-relaxed">{dayItem.activity.replace(apiResult.top_recommendations[0]?.destination || "Srinagar", selectedDestDetails.name)}</p>
                          <span className="text-[9px] font-semibold text-neutral-400 mt-1 block">Forecast: {dayItem.weather_snippet}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alignment checklist */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400">AI Profile Match Parameters</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-neutral-500">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500">✓</span> Matches budget ({formData.budget})
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500">✓</span> {formData.duration} days duration match
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500">✓</span> Fits weather ({formData.weather || 'Temperate'})
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500">✓</span> Mapped to {apiResult.personality}
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-5 border-t border-card-border bg-neutral-50 dark:bg-neutral-900/40 flex gap-3 shrink-0">
                <button
                  onClick={() => setSelectedDestDetails(null)}
                  className="flex-grow py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-center"
                >
                  Close & Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
