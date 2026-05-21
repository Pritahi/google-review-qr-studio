import { BusinessProfile } from "../types";

export interface CategoryData {
  id: string;
  name: string;
  emoji: string;
  defaultVibes: {
    [rating: number]: string[];
  };
}

export const CATEGORIES: CategoryData[] = [
  {
    id: "Restaurant",
    name: "Restaurant / Food Joint",
    emoji: "🍛",
    defaultVibes: {
      5: ["Amazing Food / Lajawab Taste 😋", "Super Fast Service ⚡", "Polite & Friendly Staff 😊", "Extremely Clean & Hygienic 🧼", "Lovely Ambience ✨", "Great Portion Size 🍱", "Worth Every Penny 💰"],
      4: ["Tasty Food 🍔", "Good Quick Service ⏱️", "Clean Environment 🧹", "Cozy Seating 🪑", "Value for Money 👍"],
      3: ["Average Taste 🍜", "Decent Service ⏱️", "Okay Seating 🛋️", "Normal Quality 🍗"],
      1: ["Terrible Taste 🤢", "Super Slow Service 🐢", "Very Dirty / Unhygienic 🤮", "Rude Behavior 😡", "Overpriced 💸", "Waste of Money ❌"]
    }
  },
  {
    id: "Cafe",
    name: "Café / Bakery",
    emoji: "☕",
    defaultVibes: {
      5: ["Superb Coffee / Drinks ☕", "Delicious Desserts 🍰", "Cozy & Aesthetic Vibe 📸", "Very Polite Baristas 😊", "Perfect Work Spot 💻", "Fast Wi-Fi 🌐"],
      4: ["Good Coffee / Tea 🫖", "Yummy Pastries 🍪", "Nice Relaxing Music 🎵", "Friendly Staff 👍"],
      3: ["Okay Coffee ☕", "Limited Seating 🪑", "Average Prices 💵"],
      1: ["Worst Coffee ever 🤮", "Stale/Expired Food 🥯", "Extremely Rude Staff 😡", "Loud & Annoying 🔊", "Too Expensive 💸"]
    }
  },
  {
    id: "Salon",
    name: "Salon / Spa / Beauty",
    emoji: "💇",
    defaultVibes: {
      5: ["Excellent Haircut/Service ✂️", "Highly Professional Staff 👑", "Super Relaxing Massage 💆", "Premium Products Used 🧴", "Great Consulting 💬", "Extremely Clean 🧼"],
      4: ["Good Styling / Service 💅", "Gentle & Polite Staff 🎀", "Clean Workstations 🧹", "Reasonable Rates 💵"],
      3: ["Decent Service 💇", "Average Waiting Time ⏱️", "Standard Results 🧴"],
      1: ["Worst Cut/Ruined Hair 😡", "Unhygienic Combs/TOWELS 🤮", "Rude/Untrained Staff 😤", "Exorbitant Charges 💸"]
    }
  },
  {
    id: "Store",
    name: "Retail Store / Shop",
    emoji: "🛍️",
    defaultVibes: {
      5: ["Huge Collection/Stock 📦", "Very Helpful Staff 🤝", "Best Discounts & Offers 🏷️", "Premium Quality Items 👕", "Easy Exchange/Billing 💳", "Great Ambience 🏬"],
      4: ["Good Variety 👍", "Neatly Organized Items 🗄️", "Friendly Cashier 😊", "Good Pricing 💰"],
      3: ["Limited Stock 📦", "Okay Pricing 💵", "Wait times at billing ⏱️"],
      1: ["No Stock / Empty Racks ❌", "Rude/Ignorant helpers 😡", "Low Quality Items 🗑️", "No Discounts/Exchange 🚫", "Terrible Experience 😤"]
    }
  },
  {
    id: "Hotel",
    name: "Hotel / Homestay / Lodge",
    emoji: "🏨",
    defaultVibes: {
      5: ["Super Cozy Rooms 🛏️", "Stunning View 🌅", "Luxury Bath / Cleanliness 🚿", "Extremely Helpful Room-service 📞", "Delicious Breakfast 🍳", "Best Location 📍"],
      4: ["Clean & Comfortable Rooms 🧼", "Good Friendly Help 🤝", "Nice Pool / Amenities 🏊", "Safe Parking 🚗"],
      3: ["Standard Rooms 🛌", "Okay Amenities 📺", "Slight delays in check-in ⏱️"],
      1: ["Dirty Bedsheets/Smelly Room 🤮", "No AC / Hot Water Issues 🥵", "Rude & Careless Staff 😡", "Noisy Environment 😤", "Total scam rooms 🚫"]
    }
  },
  {
    id: "Gym",
    name: "Gym / Fitness Club",
    emoji: "🏋️",
    defaultVibes: {
      5: ["World-class Equipment 🏋️", "Super Experienced Trainers 💪", "Motivating Music & Vibe 🔥", "Spacious and Airtight Clean 🧼", "Best Batch timings ⏱️", "Amazing Crowd 👥"],
      4: ["Good Machines 👍", "Helpful Gym Staff 🤝", "Clean Shower / Lockers 🚿", "Reasonable Membership Fees 💳"],
      3: ["Decent Equipment 🏃‍♂️", "Crowded during peak hours ⏱️", "Average Maintenance 🧹"],
      1: ["Broken Machines / Rusty Iron 🚫", "Completely Unhelpful Trainers 😡", "Suffocating / Bad Ventilation 🥵", "Extremely Dirty 🤢", "Worst Gym EVER ❌"]
    }
  },
  {
    id: "Clinic",
    name: "Clinic / Hospital / Care",
    emoji: "🩺",
    defaultVibes: {
      5: ["Highly Empathetic Doctors 🩺", "Detailed Explanation 💬", "Super Caring Nurses ❤️", "Min Wait times ⏱️", "Very Clean & Safe 🧼", "Reasonable consultation fee 💰"],
      4: ["A-grade Doctors 👨‍⚕️", "Clean and Well Lit 💡", "Polite Reception Desk 👍"],
      3: ["Standard consultation 📝", "Normal Waiting times ⏱️", "Expensive medicines 💵"],
      1: ["Extremely Careless / Ignorant Doctor 😡", "Long Wait Times (Hours!) 🐢", "Unhygienic / Dirty Clinic 🦠", "Rude Emergency Desk 😤"]
    }
  },
  {
    id: "Service",
    name: "General Business / Service",
    emoji: "🛠️",
    defaultVibes: {
      5: ["Flawless premium service ✨", "Super Professional Work 🛠️", "Very Fair Estimate 📋", "On-Time Completion ⏰", "Highly Trustworthy 🙌", "No Hidden Charges 🔒"],
      4: ["Good Quality Finish 👍", "Polite Communication 💬", "Prompt responses 📞", "Decent rates 💸"],
      3: ["Okay execution 🛠️", "Minor delay in response ⏱️", "Standard pricing 💵"],
      1: ["Total waste of money 😡", "Unprofessional work/Damage 🚮", "No reply/Ignored calls 📵", "Double-charged / Hidden costs 💸"]
    }
  }
];

export const POSTER_THEMES = [
  {
    id: "warm",
    name: "Warm Amber Golden",
    bgClass: "bg-gradient-to-br from-amber-50 to-orange-100 text-slate-900 border-amber-300",
    primaryText: "text-amber-800",
    buttonBg: "bg-amber-600 hover:bg-amber-700 text-white",
    badgeBg: "bg-amber-100 text-amber-800",
    accentGlow: "shadow-amber-200/50",
    starsColor: "fill-amber-400 text-amber-500",
    headerGrad: "from-amber-700 to-orange-700"
  },
  {
    id: "ocean",
    name: "Cool Ocean Breeze",
    bgClass: "bg-gradient-to-br from-blue-50 to-indigo-100 text-slate-900 border-blue-300",
    primaryText: "text-blue-800",
    buttonBg: "bg-blue-600 hover:bg-blue-700 text-white",
    badgeBg: "bg-blue-100 text-blue-800",
    accentGlow: "shadow-blue-200/50",
    starsColor: "fill-amber-400 text-amber-500",
    headerGrad: "from-blue-700 to-indigo-700"
  },
  {
    id: "emerald",
    name: "Natural Healthy Mint",
    bgClass: "bg-gradient-to-br from-emerald-50 to-teal-100 text-slate-900 border-emerald-300",
    primaryText: "text-emerald-850",
    buttonBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
    badgeBg: "bg-emerald-100 text-emerald-800",
    accentGlow: "shadow-emerald-200/50",
    starsColor: "fill-amber-400 text-amber-500",
    headerGrad: "from-emerald-700 to-teal-700"
  },
  {
    id: "sunset",
    name: "Enchanting Rose Sunset",
    bgClass: "bg-gradient-to-br from-rose-50 to-pink-100 text-slate-900 border-rose-300",
    primaryText: "text-rose-800",
    buttonBg: "bg-rose-600 hover:bg-rose-700 text-white",
    badgeBg: "bg-rose-100 text-rose-800",
    accentGlow: "shadow-rose-200/50",
    starsColor: "fill-amber-400 text-amber-500",
    headerGrad: "from-rose-700 to-pink-700"
  },
  {
    id: "dark",
    name: "Royal Dark Gold",
    bgClass: "bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 text-white border-zinc-700",
    primaryText: "text-amber-400",
    buttonBg: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold",
    badgeBg: "bg-slate-800 text-amber-400 border border-slate-700",
    accentGlow: "shadow-amber-500/10",
    starsColor: "fill-amber-400 text-amber-400",
    headerGrad: "from-amber-400 to-orange-400 text-transparent bg-clip-text"
  },
  {
    id: "minimal",
    name: "Sleek Modern White",
    bgClass: "bg-white text-slate-900 border-slate-200 shadow-sm",
    primaryText: "text-slate-850",
    buttonBg: "bg-slate-900 hover:bg-slate-800 text-white",
    badgeBg: "bg-slate-100 text-slate-800",
    accentGlow: "shadow-slate-200/40",
    starsColor: "fill-amber-400 text-amber-500",
    headerGrad: "from-slate-800 to-zinc-800"
  }
];

export const DEMO_PRESETS: BusinessProfile[] = [
  {
    id: "preset-tandoor",
    name: "Jha Punjabi Dhaba",
    category: "Restaurant",
    reviewUrl: "https://maps.google.com/?cid=1234567890",
    customKey: "Kadhai Paneer, Butter Naan, Dal Makhani, Lassi",
    instruction: "We love serving you hot and delicious meals! Tell us what you ordered! ♥",
    posterTheme: "warm",
    linkType: "auto",
    location: "Sector 62, Noida"
  },
  {
    id: "preset-cup",
    name: "Brew & Bites Café",
    category: "Cafe",
    reviewUrl: "https://maps.google.com/?cid=0987654321",
    customKey: "Cappuccino, Blueberry Muffin, Garlic Bread, Pasta",
    instruction: "Your daily energy fuels our passion! Get a 10% discount on scanning on your next trip! ☕️",
    posterTheme: "ocean",
    linkType: "auto",
    location: "Connaught Place, New Delhi"
  },
  {
    id: "preset-scissors",
    name: "Glamour Zone Men & Women Salon",
    category: "Salon",
    reviewUrl: "https://maps.google.com/?cid=1122334455",
    customKey: "Hair Styling, Facial, Pedicure, Facial Glow, Beard Trim",
    instruction: "Keep shining! Tell others about your pampering session with us ✨",
    posterTheme: "sunset",
    linkType: "auto",
    location: "Mumbai"
  }
];
