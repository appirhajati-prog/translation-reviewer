export interface Translator {
  id: string;
  name: string;
  avatar?: string;
}

export interface DimensionRating {
  fluency: number;
  fidelity: number;
  readability: number;
  editing: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  dimensions?: DimensionRating;
  comment: string;
  strengths: string[];
  weaknesses: string[];
  createdAt: string;
  source?: "manual" | "auto-analysis" | "external";
  sourceUrl?: string;
}

export interface Translation {
  id: string;
  bookId: string;
  translatorId: string;
  translatorName: string;
  publisher: string;
  publishYear: number;
  averageRating: number;
  dimensionAverages?: DimensionRating;
  reviewCount: number;
  reviews: Review[];
  sampleText?: string;
}

export interface Book {
  id: string;
  title: string;
  originalTitle: string;
  author: string;
  coverImage?: string;
  description: string;
  originalSampleText?: string;
  translations: Translation[];
}