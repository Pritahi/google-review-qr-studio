import { useState, useEffect } from "react";
import { Star, Sparkles, Copy, Check, ExternalLink, RotateCcw, ArrowRight, Heart } from "lucide-react";
import { CATEGORIES } from "../utils/categories";

interface ReviewFeedbackFieldProps {
  businessName: string;
  category: string;
  reviewUrl: string;
  customKey?: string;
  instruction?: string;
  theme?: string;
  isEmbedded?: boolean;
}

export default function ReviewFeedbackField({
  businessName,
  category,
  reviewUrl,
  customKey,
  instruction,
  theme = "warm",
  isEmbedded = false
}: ReviewFeedbackFieldProps) {
  const [rating, setRating] = useState<number>(5);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState<string>("");
  const [generatedReview, setGeneratedReview] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);

  const categoryConfig = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  
  const getVibesForRating = (r: number) => {
    if (r === 5) return categoryConfig.defaultVibes[5];
    if (r === 4) return categoryConfig.defaultVibes[4];
    if (r === 3) return categoryConfig.defaultVibes[3];
    return categoryConfig.defaultVibes[1];
  };

  const availableVibes = getVibesForRating(rating);

  // Reset vibes selection when rating changes
  useEffect(() => {
    setSelectedVibes([]);
  }, [rating]);

  // Loading animation cycles through professional draft steps
  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % 4);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const toggleVibe = (vibe: string) => {
    setSelectedVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    setGeneratedReview("");
    setCopied(false);
    setLoadingStep(0);

    // Clean emojis & extra local formatting for vibes to send clean text to API
    const cleanedVibes = selectedVibes.map(v => v.split("/")[0].replace(/[^\w\s-]/gi, '').trim());

    try {
      const response = await fetch("/api/generate-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          businessCategory: category,
          rating,
          vibes: cleanedVibes,
          customNote,
          tone: "Conversational",
          language: "English"
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate review");
      }

      setGeneratedReview(data.review);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to draft the review. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedReview) return;
    navigator.clipboard.writeText(generatedReview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoToGoogleAndPaste = () => {
    navigator.clipboard.writeText(generatedReview);
    setCopied(true);
  };

  const loadingMessages = [
    "Analyzing your selections...",
    "Drafting elegant English sentences...",
    "Incorporating specific tag items...",
    "Reviewing for perfect conversational tone..."
  ];

  // Modern UI Accent Schemes
  const ratingLabel = (r: number) => {
    switch (r) {
      case 5: return "Loved it! Exceptional";
      case 4: return "Very good experience";
      case 3: return "Average visit";
      case 2: return "Disappointing";
      default: return "Needs improvement";
    }
  };

  const themeColors = {
    dark: {
      accent: "text-amber-400 border-amber-500/30",
      button: "bg-amber-400 hover:bg-amber-300 text-slate-950 hover:shadow-lg hover:shadow-amber-400/10",
      chipActive: "bg-amber-400 text-slate-950 border-amber-400 font-bold",
      cardHeader: "bg-slate-900 border-b border-slate-800 text-white",
      bodyBg: "bg-slate-950 text-slate-100"
    },
    ocean: {
      accent: "text-blue-600 border-blue-200",
      button: "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/10",
      chipActive: "bg-blue-600 text-white border-blue-600 font-bold",
      cardHeader: "bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 text-blue-900",
      bodyBg: "bg-white text-slate-900"
    },
    emerald: {
      accent: "text-emerald-600 border-emerald-200",
      button: "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg hover:shadow-emerald-500/10",
      chipActive: "bg-emerald-600 text-white border-emerald-600 font-bold",
      cardHeader: "bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 text-emerald-900",
      bodyBg: "bg-white text-slate-900"
    },
    sunset: {
      accent: "text-pink-600 border-pink-200",
      button: "bg-pink-600 hover:bg-pink-700 text-white hover:shadow-lg hover:shadow-pink-500/10",
      chipActive: "bg-pink-600 text-white border-pink-600 font-bold",
      cardHeader: "bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100 text-pink-900",
      bodyBg: "bg-white text-slate-900"
    },
    warm: {
      accent: "text-amber-700 border-amber-200",
      button: "bg-amber-600 hover:bg-amber-700 text-white hover:shadow-lg hover:shadow-amber-600/10",
      chipActive: "bg-amber-600 text-white border-amber-600 font-bold",
      cardHeader: "bg-gradient-to-r from-amber-50 to-orange-50/50 border-b border-amber-100 text-amber-900",
      bodyBg: "bg-white text-slate-900"
    }
  };

  const scheme = themeColors[theme as keyof typeof themeColors] || themeColors.warm;

  const renderContent = () => (
    <div className={`w-full flex flex-col overflow-hidden bg-white text-slate-950 ${isEmbedded ? "h-full" : "rounded-3xl border border-slate-200 shadow-2xl"}`}>
      
      {/* Header Banner - Elegant, Minimal */}
      <div className={`px-6 py-7 transition-all duration-300 relative ${scheme.cardHeader}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest bg-black/5 dark:bg-white/10 px-2.5 py-1 rounded-md text-inherit">
            Customer Feedback Form
          </span>
          <span className="text-2xl filter drop-shadow-sm select-none">{categoryConfig.emoji}</span>
        </div>
        
        <h1 className="text-2xl font-black tracking-tight mt-4 leading-tight font-sans">
          {businessName}
        </h1>
        {instruction && (
          <p className="text-xs leading-relaxed mt-3 opacity-90 border-l-2 border-current/30 pl-3 font-medium">
            "{instruction}"
          </p>
        )}
      </div>

      {/* Main Body */}
      <div className={`p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar flex-1 ${theme === "dark" ? "bg-slate-950" : "bg-white"}`}>
        
        {/* Step 1: Premium Star Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            1. Rate Your Experience
          </label>
          <div className="bg-slate-50/60 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col items-center gap-2">
            <div className="flex gap-2.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition transform active:scale-90 hover:scale-110 p-1 cursor-pointer focus:outline-none"
                  id={`btn-client-star-${star}`}
                >
                  <Star
                    className={`w-9 h-9 transition-all ${
                      star <= rating 
                        ? "fill-amber-400 text-amber-400 filter drop-shadow-[0_2px_4px_rgba(251,191,36,0.3)]" 
                        : "text-slate-200 dark:text-slate-700 hover:text-slate-300 dark:hover:text-slate-600"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
              {ratingLabel(rating)}
            </span>
          </div>
        </div>

        {/* Step 2: Custom Selection Chips */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            2. What stood out? (Tap to select multiple)
          </label>
          <div className="flex flex-wrap gap-2">
            {availableVibes.map((v) => {
              const isSelected = selectedVibes.includes(v);
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => toggleVibe(v)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all duration-250 ${
                    isSelected
                      ? scheme.chipActive
                      : "bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350"
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Specific items order suggestions */}
        {(customKey || categoryConfig.id === "Restaurant" || categoryConfig.id === "Cafe") && (
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              3. Ordered Items / Services (Optional)
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder={
                customKey 
                  ? `E.g., ${customKey.split(",")[0].trim()} or ${customKey.split(",")[1]?.trim() || "other items"}` 
                  : "E.g., Butter Naan, Dal Makhani, Cappuccino"
              }
              className="w-full text-xs px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-slate-900 dark:focus:border-slate-100 focus:outline-none transition bg-slate-50/50 dark:bg-slate-905 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium placeholder-slate-400 dark:placeholder-slate-600"
            />
            {customKey && (
              <div className="flex flex-wrap gap-1.5 items-center mt-1">
                <span className="text-[9px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider mr-1">Taps:</span>
                {customKey.split(",").slice(0, 5).map((k) => {
                  const cleanedKeyword = k.trim();
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => {
                        setCustomNote((prev) => {
                          const words = prev ? prev.split(",").map(w => w.trim()).filter(Boolean) : [];
                          if (words.includes(cleanedKeyword)) return prev;
                          return [...words, cleanedKeyword].join(", ");
                        });
                      }}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-lg cursor-pointer transition active:scale-95 border border-slate-200/40 dark:border-slate-800 font-semibold"
                    >
                      +{cleanedKeyword}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer text-xs focus:outline-none ${scheme.button}`}
          id="btn-client-generate"
        >
          <Sparkles className="w-4 h-4" />
          <span>Write Review with AI</span>
        </button>

        {/* Handle Error */}
        {error && (
          <div className="p-4 bg-rose-50/60 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-xs rounded-xl font-medium border border-rose-100 dark:border-rose-950/40 flex items-start gap-2">
            <span className="shrink-0 text-rose-500">⚠️</span>
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* Dynamic Loading */}
        {isGenerating && (
          <div className="p-5 bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center gap-3 text-center">
            <div className="w-8 h-8 border-3 border-slate-200 dark:border-slate-800 border-t-slate-900 dark:border-t-white rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-tight">
              {loadingMessages[loadingStep]}
            </p>
          </div>
        )}

        {/* AI Output Panel */}
        {generatedReview && !isGenerating && (
          <div className="flex flex-col gap-4 animate-fadeIn mt-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
              ✨ Your Crafted Review Draft
            </label>

            {/* Simulated Review Card */}
            <div className="border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-5 rounded-2xl relative flex flex-col gap-4">
              <span className="absolute top-4 right-4 text-[9px] uppercase font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded border border-emerald-105">
                Draft Ready
              </span>

              {/* User Identity Indicator */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold flex items-center justify-center text-xs uppercase">
                  {businessName.slice(0, 1) || "U"}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">
                    Google Maps Reviewer
                  </h4>
                  <div className="flex gap-0.5 mt-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Review text container */}
              <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850 select-all shadow-2xs font-normal">
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  {generatedReview}
                </p>
              </div>

              {/* Copy CTA */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] text-slate-450 dark:text-slate-500 font-medium">
                  💡 Double-tap text box above to edit anything
                </span>
                
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white text-slate-600 dark:text-slate-450 font-bold text-xs py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition active:scale-95"
                  id="btn-client-copy"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-450" />
                      <span>Copy Draft</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Submission Block (Paste on Google Reviews) */}
            <div className="bg-slate-900 border border-slate-800 text-white p-5 rounded-2xl flex flex-col gap-3">
              <div>
                <h4 className="text-xs font-bold flex items-center gap-1 text-zinc-100">
                  Last Step: Paste & Post on Google Maps
                </h4>
                <p className="text-[10px] text-zinc-400 leading-relaxed mt-1">
                  Clicking below automatically copies this draft & opens the store's Google page. Simply <strong>Paste (Ctrl+V or tap and hold)</strong> and post!
                </p>
              </div>

              <a
                href={reviewUrl || `https://www.google.com/search?q=${encodeURIComponent(businessName + " Google Maps Review")}`}
                target="_blank"
                rel="noreferrer"
                onClick={handleGoToGoogleAndPaste}
                className="w-full py-3 px-5 bg-white hover:bg-zinc-100 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer text-xs text-center decoration-none"
                id="btn-client-google-submit"
              >
                <span>Go to Google & Paste</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Reset */}
            <button
              onClick={() => {
                setGeneratedReview("");
                setCustomNote("");
                setSelectedVibes([]);
              }}
              className="flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition py-2 cursor-pointer mt-1 font-bold"
              id="btn-client-restart"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset parameters</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );

  if (isEmbedded) {
    return renderContent();
  }

  // Standalone preview frame for scanned users
  return (
    <div className={`min-h-screen py-8 px-4 flex flex-col items-center justify-center bg-gradient-to-br bg-slate-50 ${theme === "dark" ? "from-slate-950 to-zinc-950" : "from-slate-50 to-zinc-100"}`}>
      <div className="w-full max-w-md">
        {renderContent()}
      </div>

      <div className="text-center mt-6 text-[10px] text-slate-400 max-w-xs font-semibold uppercase tracking-widest leading-relaxed">
        <p className="flex items-center justify-center gap-1.5 text-slate-500 mb-0.5">
          <Heart className="w-3 h-3 text-red-500 fill-red-500" /> Powered by AI Review Assistant
        </p>
        <p className="opacity-70">Supporting exceptional local outlets</p>
      </div>
    </div>
  );
}
