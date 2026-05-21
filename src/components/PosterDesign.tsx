import { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import { BusinessProfile } from "../types";
import { POSTER_THEMES } from "../utils/categories";
import { Star, Printer, Download, Sparkles, QrCode } from "lucide-react";

interface PosterDesignProps {
  profile: BusinessProfile;
}

export default function PosterDesign({ profile }: PosterDesignProps) {
  const [qrBase64, setQrBase64] = useState<string>("");
  const posterRef = useRef<HTMLDivElement>(null);

  const selectedTheme = POSTER_THEMES.find((t) => t.id === profile.posterTheme) || POSTER_THEMES[0];

  useEffect(() => {
    // Generate the URL that customers will scan
    const queryParams = new URLSearchParams();
    queryParams.set("mode", "customer");
    queryParams.set("name", profile.name);
    queryParams.set("category", profile.category);
    queryParams.set("reviewUrl", profile.reviewUrl);
    
    if (profile.customKey) {
      queryParams.set("customKey", profile.customKey);
    }
    if (profile.instruction) {
      queryParams.set("instruction", profile.instruction);
    }
    if (profile.posterTheme) {
      queryParams.set("theme", profile.posterTheme);
    }

    const scanUrl = `${window.location.origin}/?${queryParams.toString()}`;

    // Generate the QR Code
    QRCode.toDataURL(
      scanUrl,
      {
        width: 320,
        margin: 1,
        color: {
          dark: profile.posterTheme === "dark" ? "#ffffff" : "#0f172a", // Dark theme gets white QR code on dark background
          light: profile.posterTheme === "dark" ? "#0f172a" : "#ffffff",
        },
      },
      (err, url) => {
        if (err) {
          console.error("Failed to generate QR Code data URL:", err);
        } else {
          setQrBase64(url);
        }
      }
    );
  }, [profile]);

  const handlePrint = () => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden !important;
        }
        #printable-poster, #printable-poster * {
          visibility: visible !important;
        }
        #printable-poster {
          position: fixed !important;
          left: 50% !important;
          top: 50% !important;
          transform: translate(-50%, -50%) !important;
          width: 21cm !important;
          height: 29.7cm !important; /* A4 Ratio */
          border: none !important;
          box-shadow: none !important;
          background: ${profile.posterTheme === "dark" ? "linear-gradient(to bottom right, #0f172a, #18181b) !important;" : "linear-gradient(to bottom right, inherit) !important;"};
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  const handleDownloadQR = () => {
    if (!qrBase64) return;
    const link = document.createElement("a");
    link.href = qrBase64;
    link.download = `qr-code-${profile.name.toLowerCase().replace(/\s+/g, "-")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Action buttons (hidden on print) */}
      <div className="flex flex-wrap gap-3 w-full justify-center no-print">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition active:scale-95 cursor-pointer shadow-sm shadow-slate-900/10"
          id="btn-print-poster"
        >
          <Printer className="w-4 h-4" />
          Print Shop Poster (A4)
        </button>
        <button
          onClick={handleDownloadQR}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-800 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition active:scale-95 cursor-pointer shadow-sm"
          id="btn-download-qr"
        >
          <Download className="w-4 h-4" />
          Download QR Code Only
        </button>
      </div>

      {/* Aesthetic Tabletop / Wall Poster */}
      <div
        id="printable-poster"
        ref={posterRef}
        className={`w-full max-w-sm rounded-[2rem] border-4 p-8 flex flex-col items-center text-center transition-all duration-300 ${selectedTheme.bgClass} ${selectedTheme.accentGlow} shadow-xl relative overflow-hidden`}
      >
        {/* Aesthetic background details */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-5 rounded-full translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-current opacity-5 rounded-full -translate-x-8 translate-y-8"></div>

        {/* Poster Header */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/70 backdrop-blur-xs rounded-full border border-current/10 text-xs font-semibold tracking-wider uppercase mb-3 no-print">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            AI-Powered Smart Review
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight font-sans">
            How was your{" "}
            {profile.category === "Restaurant"
              ? "Meal"
              : profile.category === "Cafe"
              ? "Coffee"
              : profile.category === "Salon"
              ? "Style"
              : "Visit"}?
          </h2>
          <p className="text-xs font-medium uppercase tracking-[0.2em] mt-1.5 opacity-80">
            Tell us & Support Our Store
          </p>
        </div>

        {/* Business Name Callout */}
        <div className="w-full py-3 px-6 rounded-2xl bg-white/40 backdrop-blur-xs border border-white/40 shadow-xs mb-6 flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest opacity-60 font-semibold mb-0.5">
            Owner Profile
          </span>
          <h3 className={`text-xl font-bold truncate max-w-full ${selectedTheme.primaryText}`}>
            {profile.name}
          </h3>
        </div>

        {/* Multi Star graphic */}
        <div className="flex gap-1.5 mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className={`w-6 h-6 ${selectedTheme.starsColor}`} />
          ))}
        </div>

        {/* Centered QR Code Space */}
        <div className="relative p-4 rounded-[1.75rem] bg-white shadow-md border border-slate-100 flex items-center justify-center mb-6">
          {qrBase64 ? (
            <img src={qrBase64} alt="Scan QR Review Code" className="w-48 h-48 block rounded-xl select-none" />
          ) : (
            <div className="w-48 h-48 flex flex-col items-center justify-center gap-2 text-slate-400">
              <QrCode className="w-10 h-10 animate-bounce" />
              <span className="text-xs font-mono">Generating QR...</span>
            </div>
          )}
        </div>

        {/* Instructional Steps for Clients */}
        <div className="w-full flex flex-col gap-2.5 text-left mb-6 text-xs bg-white/30 backdrop-blur-xs p-4 rounded-xl border border-white/20">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-900/10 font-bold text-[10px] text-slate-800">
              1
            </span>
            <span className="font-medium">Scan QR code using your phone camera</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-900/10 font-bold text-[10px] text-slate-800">
              2
            </span>
            <span className="font-medium">Tap stars & select your review points</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-900/10 font-bold text-[10px] text-slate-800">
              3
            </span>
            <span className="font-medium">Copy AI-written draft & paste on Google!</span>
          </div>
        </div>

        {/* Custom store welcome instruction */}
        {profile.instruction && (
          <p className="text-xs italic font-medium opacity-90 px-2 leading-relaxed">
            "{profile.instruction}"
          </p>
        )}

        {/* Tiny footer branding */}
        <div className="mt-6 pt-4 border-t border-current/10 w-full opacity-60 flex items-center justify-center gap-1.5 text-[9px] font-mono tracking-widest uppercase no-print">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Google Review Assistant</span>
        </div>
      </div>
    </div>
  );
}
