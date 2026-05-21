import React, { useState, useEffect } from "react";
import { BusinessProfile } from "../types";
import { CATEGORIES, POSTER_THEMES, DEMO_PRESETS } from "../utils/categories";
import PosterDesign from "./PosterDesign";
import ReviewFeedbackField from "./ReviewFeedbackField";
import { 
  Building2, 
  Plus, 
  Trash2, 
  TrendingUp, 
  CheckCircle,
  QrCode,
  SmartphoneNfc,
  ChevronDown,
  Sparkles,
  Link,
  MapPin,
  HelpCircle,
  Store,
  Compass
} from "lucide-react";

export default function OwnerDashboard() {
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>("");
  
  // Active Form States
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("Restaurant");
  const [reviewUrl, setReviewUrl] = useState<string>("");
  const [customKey, setCustomKey] = useState<string>("");
  const [instruction, setInstruction] = useState<string>("");
  const [posterTheme, setPosterTheme] = useState<string>("warm");
  const [location, setLocation] = useState<string>("");
  
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showLinkHelper, setShowLinkHelper] = useState<boolean>(false);

  // Load profiles from localStorage or bootstrap presets
  useEffect(() => {
    const saved = localStorage.getItem("google_review_profiles");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as BusinessProfile[];
        if (parsed.length > 0) {
          setProfiles(parsed);
          setActiveProfileId(parsed[0].id);
          loadProfileIntoForm(parsed[0]);
        } else {
          loadPresets();
        }
      } catch (e) {
        console.error("Error reading profiles from localStorage", e);
        loadPresets();
      }
    } else {
      loadPresets();
    }
  }, []);

  const loadPresets = () => {
    setProfiles(DEMO_PRESETS);
    setActiveProfileId(DEMO_PRESETS[0].id);
    loadProfileIntoForm(DEMO_PRESETS[0]);
    localStorage.setItem("google_review_profiles", JSON.stringify(DEMO_PRESETS));
  };

  const loadProfileIntoForm = (prof: BusinessProfile) => {
    setName(prof.name);
    setCategory(prof.category);
    
    // Clean review Url parsing
    const url = prof.reviewUrl || "";
    // If it's a search fallback, don't display it directly in the input field to keep input pristine
    if (url.startsWith("https://www.google.com/search?q=")) {
      setReviewUrl("");
    } else {
      setReviewUrl(url);
    }
    
    setCustomKey(prof.customKey || "");
    setInstruction(prof.instruction || "");
    setPosterTheme(prof.posterTheme || "warm");
    setLocation(prof.location || "");
  };

  // Live Auto-Save Effect: Automatically persists inputs to localStorage in real-time
  useEffect(() => {
    if (!activeProfileId || !name.trim()) return;

    // Use direct custom URL if provided, otherwise fallback to automated google review lookup
    const finalReviewUrl = reviewUrl.trim().length > 0
      ? reviewUrl.trim()
      : `https://www.google.com/search?q=${encodeURIComponent(name.trim() + " " + (location.trim() || "") + " Google Reviews")}`;

    setProfiles((prevProfiles) => {
      const idx = prevProfiles.findIndex((p) => p.id === activeProfileId);
      if (idx === -1) return prevProfiles;

      const updatedItem: BusinessProfile = {
        id: activeProfileId,
        name: name.trim(),
        category,
        reviewUrl: finalReviewUrl,
        customKey: customKey.trim(),
        instruction: instruction.trim(),
        posterTheme,
        location: location.trim()
      };

      const updatedList = [...prevProfiles];
      updatedList[idx] = updatedItem;
      
      // Sync with localStorage
      localStorage.setItem("google_review_profiles", JSON.stringify(updatedList));
      return updatedList;
    });
  }, [name, category, reviewUrl, customKey, instruction, posterTheme, activeProfileId, location]);

  const handleSelectProfile = (id: string) => {
    const active = profiles.find((p) => p.id === id);
    if (active) {
      setActiveProfileId(id);
      loadProfileIntoForm(active);
      setSaveSuccess(false);
    }
  };

  const handleAddNewForm = () => {
    const rawId = `branch-${Date.now()}`;
    const newProfile: BusinessProfile = {
      id: rawId,
      name: "New Store Branch",
      category: "Restaurant",
      reviewUrl: "",
      customKey: "",
      instruction: "Write a short custom thank you note here!",
      posterTheme: "minimal",
      location: "New Noida"
    };

    const nextList = [...profiles, newProfile];
    setProfiles(nextList);
    setActiveProfileId(newProfile.id);
    loadProfileIntoForm(newProfile);
    localStorage.setItem("google_review_profiles", JSON.stringify(nextList));
  };

  const handleDeleteProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (profiles.length <= 1) {
      alert("You need to preserve at least one premium Business Profile!");
      return;
    }
    const confirmed = window.confirm("Are you sure you want to remove this branch scan panel?");
    if (!confirmed) return;

    const updated = profiles.filter((p) => p.id !== id);
    setProfiles(updated);
    
    if (activeProfileId === id) {
      setActiveProfileId(updated[0].id);
      loadProfileIntoForm(updated[0]);
    }
    localStorage.setItem("google_review_profiles", JSON.stringify(updated));
  };

  const triggerManualSaveNotif = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2400);
  };

  // Find active profile representation to display
  const computedReviewUrl = reviewUrl.trim().length > 0
    ? reviewUrl.trim()
    : `https://www.google.com/search?q=${encodeURIComponent((name || "Tandoor Restaurant").trim() + " " + (location || "").trim() + " Google Reviews")}`;

  const currentProfile: BusinessProfile = {
    id: activeProfileId,
    name: name || "Tandoor Restaurant",
    category,
    reviewUrl: computedReviewUrl,
    customKey,
    instruction,
    posterTheme,
    location
  };

  return (
    <div className="bg-slate-50/50 min-h-screen">
      
      {/* SaaS Premium Navbar */}
      <nav className="bg-white border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-sm shadow-md">
              G
            </div>
            <div>
              <span className="font-sans font-black text-slate-905 text-sm tracking-tight block leading-none">
                REVIEW STUDIO
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-extrabold mt-1 block">
                MERCHANT PLATFORM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-lg border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Live Sync Active
            </div>
            
            <button
              onClick={handleAddNewForm}
              className="flex items-center gap-1 px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition transform active:scale-95 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Branch</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
        
        {/* Banner Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-48 h-48 bg-slate-100 rounded-full translate-x-12 -translate-y-12"></div>
          
          <div className="space-y-2 relative z-10 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Aesthetic Google QR Generator
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed font-semibold">
              Customize gorgeous tabletop checkout posters. Enable one-scan local review submissions and let AI write high-converting English drafts in 5 seconds.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 bg-slate-50 border border-slate-200/80 p-4 rounded-xl z-10">
            <Compass className="w-8 h-8 text-amber-500 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-800">85% Higher Reviews</h4>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-none">Tap to draft removes user friction</p>
            </div>
          </div>
        </div>

        {/* Workstation Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Store Multi-Branch List (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                  Branches / Outlets
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-extrabold py-0.5 px-2 rounded-md border border-slate-200">
                  {profiles.length} Outlets
                </span>
              </div>

              {/* Stores Item list */}
              <div className="flex flex-col gap-1.5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                {profiles.map((p) => {
                  const isSelected = p.id === activeProfileId;
                  const catInfo = CATEGORIES.find((c) => c.id === p.category) || CATEGORIES[0];
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProfile(p.id)}
                      className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between group transition cursor-pointer ${
                        isSelected
                          ? "bg-slate-950 border-slate-950 text-white shadow-md shadow-slate-950/10"
                          : "bg-white hover:bg-slate-50 border-slate-200/85 text-slate-700"
                      }`}
                      id={`btn-sidebar-store-${p.id}`}
                    >
                      <div className="flex items-center gap-3 pr-2 truncate">
                        <span className="text-xl shrink-0 select-none">{catInfo.emoji}</span>
                        <div className="truncate">
                          <h4 className="font-bold text-xs truncate leading-snug">{p.name || "Unnamed Outlet"}</h4>
                          <span className={`text-[9px] uppercase tracking-widest font-extrabold mt-0.5 block ${isSelected ? "text-amber-400" : "text-slate-400"}`}>
                            {catInfo.name.split("/")[0]}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                        <button
                          onClick={(e) => handleDeleteProfile(p.id, e)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isSelected 
                              ? "hover:bg-slate-800 text-rose-300" 
                              : "hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                          }`}
                          title="Delete outlet profile"
                          id={`btn-delete-store-${p.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleAddNewForm}
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-dashed border-slate-250 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-slate-450" />
                <span>Add new store branch</span>
              </button>
            </div>

            {/* Support Widget */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-zinc-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full translate-x-8 -translate-y-8"></div>
              <div className="flex items-center gap-2 font-bold text-xs text-amber-400">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Conversion Wisdom</span>
              </div>
              <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed font-semibold">
                Customer attention span is under 10 seconds. Directing customers to custom star-rated, pre-highlighted AI English drafts lets them review in just 3 clicks!
              </p>
            </div>
          </div>

          {/* Column 2: Editor Setup Form (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-sans font-black text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Store className="w-4 h-4 text-slate-650" />
                Outlet Settings
              </h2>
              <span className="text-[9px] bg-slate-100 text-slate-750 font-black px-2 py-0.5 rounded uppercase">
                实时同步 Live
              </span>
            </div>

            <form onSubmit={triggerManualSaveNotif} className="flex flex-col gap-4">
              
              {/* Name field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Store / Restaurant Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Jha Punjabi Dhaba"
                  required
                  className="w-full text-xs px-4 py-3 border border-slate-200 rounded-xl focus:border-slate-900 focus:outline-none transition font-medium bg-slate-50/40 focus:bg-white"
                />
              </div>

              {/* Direct Maps Link - SIMPLE, OPTIONAL, DIRECTLY SETTABLE */}
              <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <Link className="w-3.5 h-3.5 text-indigo-500" />
                    Google Maps Link (Optional)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowLinkHelper(!showLinkHelper)}
                    className="text-[9px] font-bold text-slate-450 hover:text-slate-600 flex items-center gap-0.5 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Help
                  </button>
                </div>

                <input
                  type="url"
                  value={reviewUrl}
                  onChange={(e) => setReviewUrl(e.target.value)}
                  placeholder="https://maps.google.com/?cid=..."
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg bg-white focus:border-slate-900 focus:outline-none transition text-slate-800 placeholder-slate-400 font-mono"
                />

                {showLinkHelper && (
                  <div className="p-3 bg-white rounded-lg border border-slate-150 text-[10px] text-slate-500 leading-normal space-y-1.5">
                    <p className="font-bold text-slate-800">💡 Easy Manual Copy Paste:</p>
                    <p>Open your Google Maps business page &rarr; Choose the "Ask for Reviews" share option &rarr; Copy that simple link and paste it here.</p>
                  </div>
                )}

                <p className="text-[9px] text-slate-500 leading-normal font-medium">
                  {reviewUrl.trim() ? (
                    <span className="text-emerald-700 font-bold">✨ Using pasted custom Maps Link above.</span>
                  ) : (
                    <span>🌟 Left blank. We'll automatically build an optimized search shortcut for <strong className="text-slate-700">{name || "your store"}</strong> when clients scan!</span>
                  )}
                </p>
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50/40 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white cursor-pointer appearance-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Suggested Tags separated by comma */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Recommended items / dishes / highlights (Comma separated)
                </label>
                <input
                  type="text"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="Kadhai Paneer, Butter Naan, Dal Makhani, Lassi"
                  className="w-full text-xs px-4 py-3 border border-slate-200 rounded-xl focus:border-slate-900 focus:outline-none transition font-medium bg-slate-50/40 focus:bg-white text-slate-800"
                />
                <span className="text-[9px] text-slate-400 font-semibold px-0.5">
                  These fast-select items appear on customers' screens for them to select with 1 tap.
                </span>
              </div>

              {/* GREETING NOTE TEXTAREA */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Welcome Card Message (e.g., Offer or Coupon)
                </label>
                <textarea
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  rows={2}
                  maxLength={100}
                  placeholder="Review us! Get a free hot brownie on dining or a 10% discount coupon!"
                  className="w-full text-xs px-4 py-3 border border-slate-200 rounded-xl focus:border-slate-900 focus:outline-none transition font-medium bg-slate-50/40 focus:bg-white resize-none text-slate-700"
                />
              </div>

              {/* Accent Design Themes Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Poster Design Theme Accent
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {POSTER_THEMES.map((themeObj) => (
                    <button
                      key={themeObj.id}
                      type="button"
                      onClick={() => setPosterTheme(themeObj.id)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 px-2 cursor-pointer text-center group transition select-none ${
                        posterTheme === themeObj.id
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-200 hover:bg-slate-50 bg-white"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border border-slate-200/60 flex items-center justify-center bg-gradient-to-br ${
                        themeObj.id === "dark" ? "from-slate-950 to-slate-800" 
                        : themeObj.id === "warm" ? "from-amber-100 to-orange-300"
                        : themeObj.id === "ocean" ? "from-blue-100 to-indigo-300"
                        : themeObj.id === "emerald" ? "from-emerald-100 to-teal-300"
                        : themeObj.id === "sunset" ? "from-rose-100 to-pink-300"
                        : "from-white to-slate-200"
                      }`}>
                        {posterTheme === themeObj.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                        )}
                      </div>
                      <span className="text-[8px] font-bold text-slate-500 group-hover:text-slate-900 truncate max-w-full uppercase tracking-wider mt-0.5">
                        {themeObj.name.split(" ")[1] || themeObj.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer shadow-md mt-2"
                id="btn-trigger-save-notif"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Synced Outlet Configuration!
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-slate-400" />
                    Confirm Setup
                  </>
                )}
              </button>
              
            </form>
          </div>

          {/* Column 3: High resolution poster & smartphone simulator (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Screen Toggles */}
            <div className="flex bg-slate-200/50 p-1 rounded-xl w-full">
              <button
                onClick={() => setActiveTab("edit")}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-lg font-bold transition cursor-pointer select-none ${
                  activeTab === "edit" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                Counter Poster
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-lg font-bold transition cursor-pointer select-none ${
                  activeTab === "preview" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <SmartphoneNfc className="w-3.5 h-3.5" />
                Live Mobile Sandbox
              </button>
            </div>

            {activeTab === "edit" ? (
              <div className="flex flex-col items-center">
                <PosterDesign profile={currentProfile} />
              </div>
            ) : (
              /* Simulation Device Shell frame */
              <div className="flex flex-col items-center gap-4 w-full">
                <span className="text-[10px] bg-slate-900 text-zinc-100 font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider tracking-widest border border-slate-800">
                  ⚡ CUSTOMER WORKFLOW PREVIEW
                </span>
                
                {/* Visual Shell */}
                <div className="w-full max-w-[320px] h-[580px] border-[10px] border-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative bg-white flex flex-col ring-1 ring-slate-850">
                  
                  {/* Topnotch system */}
                  <div className="h-5 bg-slate-900 w-full px-5 flex items-center justify-between text-white/90 text-[8px] font-bold z-45 select-none shrink-0 relative">
                    <span>12:45 PM</span>
                    
                    <div className="w-16 h-3 bg-slate-900 absolute left-1/2 -translate-x-1/2 top-0 rounded-b-md flex items-center justify-center">
                      <span className="w-4.5 h-0.5 bg-zinc-850 rounded-full block"></span>
                    </div>

                    <div className="flex items-center gap-1 text-[8px]">
                      <span>5G</span>
                      <span>🔋 100%</span>
                    </div>
                  </div>

                  {/* Built-in webframe simulator */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-slate-100">
                    <ReviewFeedbackField
                      businessName={currentProfile.name}
                      category={currentProfile.category}
                      reviewUrl={currentProfile.reviewUrl}
                      customKey={currentProfile.customKey}
                      instruction={currentProfile.instruction}
                      theme={currentProfile.posterTheme}
                      isEmbedded={true}
                    />
                  </div>

                </div>
                <p className="text-[10px] text-slate-420 text-center px-4 leading-relaxed font-semibold">
                  This simulated screen demonstrates the customer scanner experience. They tap highlights, ordered dishes or styling treatments, and AI drafts their Google review instantly.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
