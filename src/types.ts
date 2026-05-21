export interface BusinessProfile {
  id: string;
  name: string;
  category: string;
  reviewUrl: string;
  customKey?: string;
  instruction?: string;
  posterTheme?: string;
  location?: string;
  linkType?: "auto" | "manual";
}

export interface ReviewState {
  rating: number;
  vibes: string[];
  customNote: string;
  tone: string;
  language: string;
  generatedReview?: string;
  isGenerating: boolean;
  error?: string;
}
