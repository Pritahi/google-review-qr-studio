import { useState, useEffect } from "react";
import OwnerDashboard from "./components/OwnerDashboard";
import ReviewFeedbackField from "./components/ReviewFeedbackField";

export default function App() {
  const [isCustomerMode, setIsCustomerMode] = useState<boolean>(false);
  
  // Parsed customer params
  const [customerParams, setCustomerParams] = useState<{
    name: string;
    category: string;
    reviewUrl: string;
    customKey?: string;
    instruction?: string;
    theme?: string;
  } | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const mode = searchParams.get("mode");
    const name = searchParams.get("name");
    const category = searchParams.get("category");
    const reviewUrl = searchParams.get("reviewUrl");
    const customKey = searchParams.get("customKey");
    const instruction = searchParams.get("instruction");
    const theme = searchParams.get("theme");

    // Route selector: if a reviewUrl or name is explicitly present with customer mode, route to customer review panel
    if (mode === "customer" || reviewUrl) {
      setIsCustomerMode(true);
      setCustomerParams({
        name: name || "Our Store",
        category: category || "Restaurant",
        reviewUrl: reviewUrl || "https://maps.google.com",
        customKey: customKey || undefined,
        instruction: instruction || undefined,
        theme: theme || "warm"
      });
    } else {
      setIsCustomerMode(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 select-none antialiased">
      {isCustomerMode && customerParams ? (
        <ReviewFeedbackField
          businessName={customerParams.name}
          category={customerParams.category}
          reviewUrl={customerParams.reviewUrl}
          customKey={customerParams.customKey}
          instruction={customerParams.instruction}
          theme={customerParams.theme}
        />
      ) : (
        <OwnerDashboard />
      )}
    </div>
  );
}
