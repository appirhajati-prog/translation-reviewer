/** Typed API client: talks to FastAPI when configured, falls back to mockData. */
import { Book, Review } from "@/types";
import { mockBooks } from "@/data/mockData";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

export const isApiEnabled = API_URL.length > 0;

function mapReview(r: any): Review {
  const split = (v: unknown): string[] => {
    if (Array.isArray(v)) return v;
    if (typeof v !== "string" || !v.trim()) return [];
    // backend may already join with "، " — split on both separators
    return v.split(/[،,]/).map((s) => s.trim()).filter(Boolean);
  };
  return {
    id: String(r.id),
    userId: String(r.id),
    userName: r.user_name ?? r.userName ?? "کاربر ناشناس",
    rating: r.rating,
    dimensions: {
      fluency: r.fluency ?? r.dimensions?.fluency ?? 3,
      fidelity: r.fidelity ?? r.dimensions?.fidelity ?? 3,
      readability: r.readability ?? r.dimensions?.readability ?? 3,
      editing: r.editing ?? r.dimensions?.editing ?? 3,
    },
    comment: r.comment ?? "",
    strengths: split(r.strengths),
    weaknesses: split(r.weaknesses),
    createdAt: r.created_at ?? r.createdAt ?? "",
    source: r.source ?? "manual",
    sourceUrl: r.source_url ?? r.sourceUrl ?? "",
  };
}

function mapBook(b: any): Book {
  return {
    id: String(b.id),
    title: b.title,
    originalTitle: b.original_title ?? b.originalTitle ?? "",
    author: b.author,
    description: b.description,
    originalSampleText: b.original_sample_text ?? b.originalSampleText,
    translations: (b.translations ?? []).map((t: any) => ({
      id: String(t.id),
      bookId: String(t.book_id ?? t.bookId ?? b.id),
      translatorId: String(t.translator_id ?? t.translatorId ?? ""),
      translatorName: t.translator_name ?? t.translatorName ?? "",
      publisher: t.publisher ?? "",
      publishYear: t.publish_year ?? t.publishYear ?? 0,
      averageRating: t.average_rating ?? t.averageRating ?? 0,
      dimensionAverages: t.dimension_averages
        ? t.dimension_averages
        : t.dimensionAverages,
      reviewCount: t.review_count ?? t.reviewCount ?? (t.reviews?.length ?? 0),
      sampleText: t.sample_text ?? t.sampleText,
      reviews: (t.reviews ?? []).map(mapReview),
    })),
  };
}

export async function fetchBooks(): Promise<Book[]> {
  if (!isApiEnabled) return mockBooks;
  const res = await fetch(`${API_URL}/api/books`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  return (data as any[]).map(mapBook);
}

export async function fetchBook(id: string): Promise<Book | undefined> {
  if (!isApiEnabled) return mockBooks.find((b) => b.id === id);
  try {
    const res = await fetch(`${API_URL}/api/books/${id}`, { cache: "no-store" });
    if (!res.ok) return mockBooks.find((b) => b.id === id);
    return mapBook(await res.json());
  } catch {
    return mockBooks.find((b) => b.id === id);
  }
}

export interface NewReview {
  user_name: string;
  rating: number;
  fluency: number;
  fidelity: number;
  readability: number;
  editing: number;
  comment: string;
  strengths: string;
  weaknesses: string;
}

export async function postReview(
  translationId: string,
  payload: NewReview
): Promise<Review> {
  if (!isApiEnabled) throw new Error("API not configured");
  const res = await fetch(`${API_URL}/api/translations/${translationId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API ${res.status}`);
  }
  return mapReview(await res.json());
}

export interface AnalysisJob {
  id: number;
  translation_id: string;
  status: "pending" | "running" | "done" | "error";
  sources: string;
  comments_found: number;
  avg_rating: number;
  summary: string;
  error: string;
  created_at: string;
}

export async function analyzeTranslation(
  translationId: string,
  sourceUrls: string[] = [],
  maxPages = 5
): Promise<{ job_id: number; status: string }> {
  if (!isApiEnabled) throw new Error("API not configured");
  const res = await fetch(`${API_URL}/api/translations/${translationId}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source_urls: sourceUrls, max_pages: maxPages }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API ${res.status}`);
  }
  return res.json();
}

export async function getAnalysisJob(
  translationId: string,
  jobId: number
): Promise<AnalysisJob> {
  const res = await fetch(
    `${API_URL}/api/translations/${translationId}/analyze/${jobId}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}
