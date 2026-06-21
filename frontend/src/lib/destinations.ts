/**
 * VoyageIQ Shared Destination Database
 * 60+ destinations across India + international, synced across
 * Discover, Route Explorer, AI Insights, and Dashboard recommendations.
 */

export interface Destination {
  name: string;
  state: string;          // state / country
  category: string;       // Mountains | Beaches | Forests | Lakes | Snow | Historic | Islands | Desert | Spiritual | Wildlife
  tags: string[];         // mood tags: relaxing, adventure, romantic, offbeat, budget, luxury, cultural, nature
  cost: string;           // ₹ estimate
  crowd: "Low" | "Medium" | "High";
  weather: string;
  match: number;          // base match score
  image: string;
  desc: string;
  hiddenGemScore: number; // 1-10 (10 = very offbeat)
  isIndia: boolean;
}

export const ALL_DESTINATIONS: Destination[] = [
  // ── MOUNTAINS ─────────────────────────────────────────────────────────────
  { name: "Leh Ladakh", state: "J&K", category: "Mountains", tags: ["adventure", "offbeat", "nature", "spiritual"], cost: "₹24,000", crowd: "Low", weather: "Cold (5°C)", match: 94, image: "https://images.unsplash.com/photo-1595411425732-e69c1abe2763?w=600&auto=format&fit=crop", desc: "High-altitude desert routes, Pangong lake, Buddhist monasteries.", hiddenGemScore: 7, isIndia: true },
  { name: "Manali", state: "Himachal Pradesh", category: "Snow", tags: ["adventure", "romantic", "nature"], cost: "₹8,200", crowd: "High", weather: "Cold (12°C)", match: 90, image: "https://images.unsplash.com/photo-1590577976322-3d2d6e2130d5?w=600&auto=format&fit=crop", desc: "Snow peaks, Solang Valley, paragliding and river crossings.", hiddenGemScore: 3, isIndia: true },
  { name: "Spiti Valley", state: "Himachal Pradesh", category: "Mountains", tags: ["adventure", "offbeat", "nature", "spiritual"], cost: "₹15,000", crowd: "Low", weather: "Cold (3°C)", match: 91, image: "https://images.unsplash.com/photo-1595411425732-e69c1abe2763?w=600&auto=format&fit=crop", desc: "Remote cold desert valley with ancient monasteries and sky-high passes.", hiddenGemScore: 9, isIndia: true },
  { name: "Sikkim", state: "Sikkim", category: "Mountains", tags: ["nature", "offbeat", "spiritual", "relaxing"], cost: "₹12,800", crowd: "Low", weather: "Cold (11°C)", match: 89, image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop", desc: "Buddhist monasteries, pristine lakes, and snow-capped peaks.", hiddenGemScore: 7, isIndia: true },
  { name: "Darjeeling", state: "West Bengal", category: "Mountains", tags: ["relaxing", "romantic", "cultural", "nature"], cost: "₹9,000", crowd: "Medium", weather: "Temperate (14°C)", match: 87, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop", desc: "Misty tea gardens, Kanchenjunga views, toy train rides.", hiddenGemScore: 4, isIndia: true },
  { name: "Shimla", state: "Himachal Pradesh", category: "Snow", tags: ["romantic", "relaxing", "cultural"], cost: "₹7,200", crowd: "High", weather: "Cold (10°C)", match: 89, image: "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&auto=format&fit=crop", desc: "Colonial architecture, snowy ridge walks, toy train transit.", hiddenGemScore: 2, isIndia: true },
  { name: "Dehradun & Mussoorie", state: "Uttarakhand", category: "Mountains", tags: ["relaxing", "romantic", "nature"], cost: "₹9,500", crowd: "Medium", weather: "Cold (15°C)", match: 88, image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600&auto=format&fit=crop", desc: "Doon valley overlooks, colonial Mall Road, Kempty waterfall.", hiddenGemScore: 3, isIndia: true },
  { name: "Nainital", state: "Uttarakhand", category: "Lakes", tags: ["romantic", "relaxing", "nature"], cost: "₹8,100", crowd: "Medium", weather: "Cold (12°C)", match: 87, image: "https://images.unsplash.com/photo-1615966650071-855b15f29ad1?w=600&auto=format&fit=crop", desc: "Emerald lake, yacht rides, cable car viewpoints.", hiddenGemScore: 3, isIndia: true },
  { name: "Chopta & Tungnath", state: "Uttarakhand", category: "Mountains", tags: ["adventure", "offbeat", "spiritual", "nature"], cost: "₹7,500", crowd: "Low", weather: "Cold (5°C)", match: 88, image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600&auto=format&fit=crop", desc: "Mini Switzerland of India — meadows leading to highest Shiva temple.", hiddenGemScore: 9, isIndia: true },
  { name: "Munsiyari", state: "Uttarakhand", category: "Mountains", tags: ["adventure", "offbeat", "nature"], cost: "₹10,000", crowd: "Low", weather: "Cold (7°C)", match: 87, image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600&auto=format&fit=crop", desc: "Gateway to Himalayan glaciers, tribal culture, and Panchachuli views.", hiddenGemScore: 10, isIndia: true },
  { name: "Kasol & Kheerganga", state: "Himachal Pradesh", category: "Mountains", tags: ["adventure", "offbeat", "budget", "nature"], cost: "₹6,000", crowd: "Medium", weather: "Cold (12°C)", match: 86, image: "https://images.unsplash.com/photo-1590577976322-3d2d6e2130d5?w=600&auto=format&fit=crop", desc: "Hippie village in Parvati Valley, hot springs, riverside camping.", hiddenGemScore: 7, isIndia: true },
  { name: "Tawang", state: "Arunachal Pradesh", category: "Mountains", tags: ["offbeat", "spiritual", "cultural", "nature"], cost: "₹18,000", crowd: "Low", weather: "Cold (4°C)", match: 90, image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop", desc: "Remote monastery town on the Himalayas, near Bhutan border.", hiddenGemScore: 10, isIndia: true },
  { name: "Ziro Valley", state: "Arunachal Pradesh", category: "Forests", tags: ["offbeat", "cultural", "nature", "relaxing"], cost: "₹14,000", crowd: "Low", weather: "Temperate (15°C)", match: 88, image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop", desc: "UNESCO tentative list — Apatani tribal culture, rice terraces.", hiddenGemScore: 10, isIndia: true },
  { name: "Gulmarg", state: "J&K", category: "Snow", tags: ["adventure", "luxury", "romantic"], cost: "₹18,000", crowd: "Medium", weather: "Cold (3°C)", match: 93, image: "https://images.unsplash.com/photo-1486916856992-e4db22c8df33?w=600&auto=format&fit=crop", desc: "Premier skiing resort, Gondola rides, snow meadows.", hiddenGemScore: 4, isIndia: true },
  { name: "Srinagar", state: "J&K", category: "Lakes", tags: ["romantic", "relaxing", "cultural", "luxury"], cost: "₹14,500", crowd: "Medium", weather: "Cold (8°C)", match: 96, image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600&auto=format&fit=crop", desc: "Dal Lake houseboats, Mughal gardens, shikara rides.", hiddenGemScore: 4, isIndia: true },

  // ── BEACHES ───────────────────────────────────────────────────────────────
  { name: "Goa", state: "Goa", category: "Beaches", tags: ["relaxing", "adventure", "budget", "luxury"], cost: "₹6,500", crowd: "High", weather: "Warm (30°C)", match: 92, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop", desc: "Budget beach orientation, shacks, and coastal road drives.", hiddenGemScore: 1, isIndia: true },
  { name: "Gokarna", state: "Karnataka", category: "Beaches", tags: ["offbeat", "budget", "relaxing", "spiritual"], cost: "₹5,800", crowd: "Medium", weather: "Warm (28°C)", match: 89, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop", desc: "Offbeat Om Beach trek, half-moon beach, laid-back shacks.", hiddenGemScore: 7, isIndia: true },
  { name: "Varkala", state: "Kerala", category: "Beaches", tags: ["relaxing", "spiritual", "offbeat", "romantic"], cost: "₹7,900", crowd: "Medium", weather: "Warm (29°C)", match: 90, image: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=600&auto=format&fit=crop", desc: "Cliffside beach, yoga retreats, Arabian Sea sunsets.", hiddenGemScore: 6, isIndia: true },
  { name: "Radhanagar Beach, Havelock", state: "Andaman", category: "Beaches", tags: ["luxury", "offbeat", "romantic", "nature"], cost: "₹22,000", crowd: "Low", weather: "Warm (28°C)", match: 91, image: "https://images.unsplash.com/photo-1586699253884-e199770f63b9?w=600&auto=format&fit=crop", desc: "Asia's best beach — turquoise water, white sand, no crowds.", hiddenGemScore: 8, isIndia: true },
  { name: "Tarkarli", state: "Maharashtra", category: "Beaches", tags: ["offbeat", "adventure", "budget", "nature"], cost: "₹5,200", crowd: "Low", weather: "Warm (29°C)", match: 87, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop", desc: "Pristine beach with scuba diving, coral reefs, beach huts.", hiddenGemScore: 9, isIndia: true },
  { name: "Diu", state: "Daman & Diu", category: "Beaches", tags: ["offbeat", "budget", "relaxing", "cultural"], cost: "₹5,500", crowd: "Low", weather: "Warm (30°C)", match: 86, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop", desc: "Portuguese fort island, deserted beaches, and cheap seafood.", hiddenGemScore: 8, isIndia: true },

  // ── ISLANDS ───────────────────────────────────────────────────────────────
  { name: "Andaman Islands", state: "Andaman & Nicobar", category: "Islands", tags: ["adventure", "nature", "romantic", "luxury"], cost: "₹16,000", crowd: "Low", weather: "Warm (27°C)", match: 86, image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&auto=format&fit=crop", desc: "Coral reefs, scuba diving, pristine isolated beaches.", hiddenGemScore: 6, isIndia: true },
  { name: "Lakshadweep", state: "Lakshadweep", category: "Islands", tags: ["luxury", "offbeat", "nature", "romantic"], cost: "₹28,000", crowd: "Low", weather: "Warm (28°C)", match: 91, image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&auto=format&fit=crop", desc: "Unspoiled white sand lagoons, coral reefs, restricted entry.", hiddenGemScore: 10, isIndia: true },
  { name: "Majuli Island", state: "Assam", category: "Islands", tags: ["offbeat", "cultural", "spiritual", "nature"], cost: "₹8,000", crowd: "Low", weather: "Temperate (22°C)", match: 88, image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop", desc: "World's largest river island — Vaishnavite monasteries, tribal culture.", hiddenGemScore: 10, isIndia: true },

  // ── FORESTS / NATURE ──────────────────────────────────────────────────────
  { name: "Munnar", state: "Kerala", category: "Forests", tags: ["nature", "romantic", "relaxing"], cost: "₹9,800", crowd: "Low", weather: "Temperate (19°C)", match: 90, image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&auto=format&fit=crop", desc: "Tea plantation walks, misty hill roads, waterfalls.", hiddenGemScore: 4, isIndia: true },
  { name: "Wayanad", state: "Kerala", category: "Forests", tags: ["nature", "wildlife", "offbeat", "relaxing"], cost: "₹8,500", crowd: "Low", weather: "Temperate (22°C)", match: 86, image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop", desc: "Spice plantations, wildlife sanctuary, treehouse stays.", hiddenGemScore: 6, isIndia: true },
  { name: "Coorg", state: "Karnataka", category: "Forests", tags: ["nature", "romantic", "relaxing", "offbeat"], cost: "₹9,200", crowd: "Medium", weather: "Temperate (18°C)", match: 87, image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop", desc: "Coffee plantations, spice estates, elephant camps.", hiddenGemScore: 5, isIndia: true },
  { name: "Ooty", state: "Tamil Nadu", category: "Mountains", tags: ["nature", "romantic", "relaxing"], cost: "₹7,800", crowd: "High", weather: "Temperate (15°C)", match: 88, image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&auto=format&fit=crop", desc: "Botanical gardens, tea plantations, heritage toy train.", hiddenGemScore: 2, isIndia: true },
  { name: "Bandipur & Nagarhole", state: "Karnataka", category: "Wildlife", tags: ["wildlife", "nature", "adventure", "offbeat"], cost: "₹11,000", crowd: "Low", weather: "Warm (25°C)", match: 86, image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop", desc: "Tiger reserve safaris, elephant corridor, birdwatching.", hiddenGemScore: 7, isIndia: true },
  { name: "Kaziranga", state: "Assam", category: "Wildlife", tags: ["wildlife", "nature", "offbeat", "adventure"], cost: "₹13,000", crowd: "Low", weather: "Temperate (22°C)", match: 87, image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop", desc: "UNESCO World Heritage — one-horned rhino safari on elephant back.", hiddenGemScore: 8, isIndia: true },
  { name: "Pench Tiger Reserve", state: "Madhya Pradesh", category: "Wildlife", tags: ["wildlife", "nature", "adventure", "offbeat"], cost: "₹10,500", crowd: "Low", weather: "Warm (26°C)", match: 85, image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop", desc: "Rudyard Kipling's Jungle Book inspiration — tiger and leopard sightings.", hiddenGemScore: 8, isIndia: true },

  // ── HISTORIC / CULTURAL ───────────────────────────────────────────────────
  { name: "Agra", state: "Uttar Pradesh", category: "Historic", tags: ["cultural", "romantic", "budget"], cost: "₹5,200", crowd: "High", weather: "Warm (28°C)", match: 85, image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop", desc: "Taj Mahal, Agra Fort, Mughal architecture.", hiddenGemScore: 1, isIndia: true },
  { name: "Udaipur", state: "Rajasthan", category: "Historic", tags: ["romantic", "cultural", "luxury"], cost: "₹11,000", crowd: "Medium", weather: "Temperate (24°C)", match: 88, image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop", desc: "Lake palaces, heritage walks, boat transit.", hiddenGemScore: 3, isIndia: true },
  { name: "Jaipur", state: "Rajasthan", category: "Historic", tags: ["cultural", "adventure", "budget"], cost: "₹6,500", crowd: "High", weather: "Warm (28°C)", match: 86, image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop", desc: "Pink City — Amber Fort, Hawa Mahal, bazaars.", hiddenGemScore: 2, isIndia: true },
  { name: "Khajuraho", state: "Madhya Pradesh", category: "Historic", tags: ["cultural", "offbeat", "spiritual"], cost: "₹7,000", crowd: "Low", weather: "Warm (27°C)", match: 85, image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop", desc: "UNESCO World Heritage temples with intricate medieval sculptures.", hiddenGemScore: 7, isIndia: true },
  { name: "Hampi", state: "Karnataka", category: "Historic", tags: ["cultural", "offbeat", "budget", "adventure"], cost: "₹5,500", crowd: "Low", weather: "Warm (30°C)", match: 88, image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop", desc: "Vijayanagara Empire ruins, boulder landscapes, banana plantations.", hiddenGemScore: 8, isIndia: true },
  { name: "Varanasi", state: "Uttar Pradesh", category: "Spiritual", tags: ["spiritual", "cultural", "offbeat"], cost: "₹5,000", crowd: "High", weather: "Warm (27°C)", match: 84, image: "https://images.unsplash.com/photo-1561361058-c24e01c88b42?w=600&auto=format&fit=crop", desc: "Sacred Ganges ghats, Ganga Aarti, ancient temples.", hiddenGemScore: 3, isIndia: true },
  { name: "Rishikesh", state: "Uttarakhand", category: "Spiritual", tags: ["spiritual", "adventure", "nature", "budget"], cost: "₹5,500", crowd: "High", weather: "Temperate (20°C)", match: 91, image: "https://images.unsplash.com/photo-1561361058-c24e01c88b42?w=600&auto=format&fit=crop", desc: "Yoga capital of the world — Ganga rafting, ashrams, Laxman Jhula.", hiddenGemScore: 3, isIndia: true },
  { name: "Madurai", state: "Tamil Nadu", category: "Spiritual", tags: ["spiritual", "cultural", "budget"], cost: "₹4,500", crowd: "Medium", weather: "Warm (32°C)", match: 84, image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop", desc: "Meenakshi Amman temple, jasmine markets, temple town culture.", hiddenGemScore: 5, isIndia: true },
  { name: "Orchha", state: "Madhya Pradesh", category: "Historic", tags: ["offbeat", "cultural", "spiritual", "relaxing"], cost: "₹5,000", crowd: "Low", weather: "Warm (26°C)", match: 87, image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop", desc: "Medieval Bundela kingdom — temples, cenotaphs, riverside forts.", hiddenGemScore: 9, isIndia: true },
  { name: "Mandu", state: "Madhya Pradesh", category: "Historic", tags: ["offbeat", "cultural", "romantic"], cost: "₹4,500", crowd: "Low", weather: "Warm (25°C)", match: 85, image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop", desc: "Ruined city of joy — Afghan architecture, love story of Baz Bahadur.", hiddenGemScore: 9, isIndia: true },

  // ── DESERT ────────────────────────────────────────────────────────────────
  { name: "Jaisalmer", state: "Rajasthan", category: "Desert", tags: ["adventure", "cultural", "offbeat", "romantic"], cost: "₹7,500", crowd: "Medium", weather: "Hot (35°C)", match: 87, image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop", desc: "Golden Fort, camel safaris, Sam sand dunes.", hiddenGemScore: 4, isIndia: true },
  { name: "Rann of Kutch", state: "Gujarat", category: "Desert", tags: ["offbeat", "cultural", "adventure", "nature"], cost: "₹9,000", crowd: "Low", weather: "Warm (28°C)", match: 88, image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop", desc: "White salt desert under full moon, tribal crafts, flamingos.", hiddenGemScore: 9, isIndia: true },

  // ── NORTHEAST INDIA ───────────────────────────────────────────────────────
  { name: "Meghalaya", state: "Meghalaya", category: "Forests", tags: ["offbeat", "adventure", "nature"], cost: "₹12,000", crowd: "Low", weather: "Temperate (18°C)", match: 90, image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop", desc: "Living root bridges, wettest place on earth, crystal-clear rivers.", hiddenGemScore: 9, isIndia: true },
  { name: "Dzukou Valley", state: "Nagaland", category: "Mountains", tags: ["offbeat", "adventure", "nature"], cost: "₹10,000", crowd: "Low", weather: "Cold (10°C)", match: 88, image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop", desc: "Valley of flowers in the Northeast — seasonal lily blooms.", hiddenGemScore: 10, isIndia: true },

  // ── INTERNATIONAL ─────────────────────────────────────────────────────────
  { name: "Kyoto, Japan", state: "Japan", category: "Historic", tags: ["cultural", "romantic", "luxury", "spiritual"], cost: "₹95,000", crowd: "Medium", weather: "Temperate (16°C)", match: 80, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop", desc: "Ancient temples, bamboo forests, cherry blossom shrines.", hiddenGemScore: 2, isIndia: false },
  { name: "Chamonix, French Alps", state: "France", category: "Mountains", tags: ["adventure", "luxury", "nature"], cost: "₹1,20,000", crowd: "Low", weather: "Cold (2°C)", match: 78, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop", desc: "Skiing under Mont Blanc, cable cars, alpine glaciers.", hiddenGemScore: 3, isIndia: false },
  { name: "Bali, Indonesia", state: "Indonesia", category: "Islands", tags: ["relaxing", "spiritual", "romantic", "budget"], cost: "₹45,000", crowd: "High", weather: "Warm (29°C)", match: 83, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop", desc: "Volcanic mountains, rice terraces, beaches, coral reefs.", hiddenGemScore: 2, isIndia: false },
  { name: "Krabi, Thailand", state: "Thailand", category: "Islands", tags: ["adventure", "budget", "relaxing", "romantic"], cost: "₹38,000", crowd: "High", weather: "Warm (30°C)", match: 84, image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&auto=format&fit=crop", desc: "Limestone cliffs, emerald lagoons, boat tours.", hiddenGemScore: 2, isIndia: false },
  { name: "Rome, Italy", state: "Italy", category: "Historic", tags: ["cultural", "romantic", "luxury"], cost: "₹1,10,000", crowd: "High", weather: "Temperate (20°C)", match: 75, image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop", desc: "Colosseum, Vatican museums, Roman ruins.", hiddenGemScore: 1, isIndia: false },
  { name: "Cape Town, South Africa", state: "South Africa", category: "Beaches", tags: ["adventure", "nature", "luxury", "cultural"], cost: "₹1,30,000", crowd: "Medium", weather: "Temperate (18°C)", match: 77, image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&auto=format&fit=crop", desc: "Table Mountain, Cape Point coastal drives, penguin colonies.", hiddenGemScore: 3, isIndia: false },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Filter destinations by category and/or tags */
export function filterDestinations(
  dests: Destination[],
  { category, tags, maxCost, onlyIndia, minHiddenGem }: {
    category?: string;
    tags?: string[];
    maxCost?: number;
    onlyIndia?: boolean;
    minHiddenGem?: number;
  }
): Destination[] {
  return dests.filter(d => {
    if (category && category !== "All" && d.category !== category) return false;
    if (tags?.length && !tags.some(t => d.tags.includes(t))) return false;
    if (onlyIndia && !d.isIndia) return false;
    if (minHiddenGem && d.hiddenGemScore < minHiddenGem) return false;
    return true;
  });
}

/** Get all unique categories */
export const CATEGORIES = ["All", "Mountains", "Beaches", "Islands", "Forests", "Snow", "Historic", "Desert", "Spiritual", "Wildlife", "Lakes"];

/** Get all cities for Route Explorer dropdown */
export const ALL_CITIES = [
  ...new Set(
    ALL_DESTINATIONS
      .filter(d => d.isIndia)
      .map(d => d.name.split(" ")[0])  // first word
      .concat([
        "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
        "Pune", "Lucknow", "Ahmedabad", "Bhopal", "Patna", "Kochi",
        "Chandigarh", "Amritsar", "Jodhpur", "Haridwar", "Puri", "Shillong"
      ])
  )
].sort();

/** Groq-powered: generate extra AI destinations based on questionnaire answers */
export async function generateGroqDestinations(
  prompt: string,
  apiKey: string,
  count = 6
): Promise<Partial<Destination>[]> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are VoyageIQ, an expert Indian travel recommendation AI. 
You specialize in finding OFFBEAT, HIDDEN, and LESSER-KNOWN destinations alongside mainstream ones.
Always include a mix of well-known and very obscure places. 
Respond ONLY with a valid JSON array, no other text.`,
        },
        {
          role: "user",
          content: `${prompt}

Generate exactly ${count} travel destination recommendations.
Return a JSON array where each object has exactly these fields:
{
  "name": "City/Place Name",
  "state": "State, India or Country",
  "category": "Mountains|Beaches|Islands|Forests|Snow|Historic|Desert|Spiritual|Wildlife|Lakes",
  "cost": "₹X,XXX (5-day estimate)",
  "crowd": "Low|Medium|High",
  "weather": "description (temp)",
  "match": number 70-99,
  "desc": "2-sentence description",
  "hiddenGemScore": number 1-10,
  "tags": ["tag1","tag2"]
}

Include at least 3 very offbeat/hidden gems (hiddenGemScore >= 8) that most people don't know about.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 1200,
    }),
  });

  if (!res.ok) throw new Error(`Groq error ${res.status}`);
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content?.trim() || "[]";
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) return [];
  try {
    return JSON.parse(match[0]);
  } catch {
    return [];
  }
}

/** Map destination name to a reliable Unsplash image */
const IMAGE_MAP: Record<string, string> = {
  ladakh:     "https://images.unsplash.com/photo-1595411425732-e69c1abe2763?w=600&auto=format&fit=crop",
  spiti:      "https://images.unsplash.com/photo-1595411425732-e69c1abe2763?w=600&auto=format&fit=crop",
  manali:     "https://images.unsplash.com/photo-1590577976322-3d2d6e2130d5?w=600&auto=format&fit=crop",
  shimla:     "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&auto=format&fit=crop",
  srinagar:   "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600&auto=format&fit=crop",
  gulmarg:    "https://images.unsplash.com/photo-1486916856992-e4db22c8df33?w=600&auto=format&fit=crop",
  sikkim:     "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop",
  darjeeling: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop",
  munnar:     "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&auto=format&fit=crop",
  ooty:       "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&auto=format&fit=crop",
  coorg:      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop",
  wayanad:    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop",
  goa:        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop",
  gokarna:    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop",
  varkala:    "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=600&auto=format&fit=crop",
  andaman:    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&auto=format&fit=crop",
  agra:       "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop",
  udaipur:    "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop",
  jaipur:     "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop",
  jaisalmer:  "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop",
  varanasi:   "https://images.unsplash.com/photo-1561361058-c24e01c88b42?w=600&auto=format&fit=crop",
  rishikesh:  "https://images.unsplash.com/photo-1561361058-c24e01c88b42?w=600&auto=format&fit=crop",
  hampi:      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop",
  meghalaya:  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop",
  tawang:     "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop",
  kaziranga:  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop",
  kyoto:      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop",
  bali:       "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop",
  krabi:      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&auto=format&fit=crop",
  rome:       "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop",
  default:    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop",
};

export function getDestImage(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(IMAGE_MAP)) {
    if (lower.includes(key)) return url;
  }
  return `https://images.unsplash.com/featured/800x600/?travel,${encodeURIComponent(name)}`;
}
