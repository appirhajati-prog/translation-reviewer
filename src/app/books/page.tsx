"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { mockBooks } from "@/data/mockData";

export default function BooksPage() {
  const [query, setQuery] = useState("");
  const [publisher, setPublisher] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<"rating" | "translations">("rating");

  const allPublishers = useMemo(() => {
    const set = new Set<string>();
    mockBooks.forEach((b) =>
      b.translations.forEach((t) => set.add(t.publisher))
    );
    return Array.from(set);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = mockBooks.filter((book) => {
      if (
        publisher !== "all" &&
        !book.translations.some((t) => t.publisher === publisher)
      )
        return false;
      const best = Math.max(
        ...book.translations.map((t) => t.averageRating)
      );
      if (best < minRating) return false;
      if (!q) return true;
      if (
        book.title.toLowerCase().includes(q) ||
        book.originalTitle.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q)
      )
        return true;
      for (const t of book.translations) {
        if (t.translatorName.toLowerCase().includes(q)) return true;
        if (t.publisher.toLowerCase().includes(q)) return true;
        if (String(t.publishYear).includes(q)) return true;
        if (t.sampleText && t.sampleText.includes(query.trim())) return true;
        for (const r of t.reviews) {
          if (r.comment.includes(query.trim())) return true;
          if (r.userName.includes(query.trim())) return true;
          if (r.strengths.some((s) => s.includes(query.trim()))) return true;
          if (r.weaknesses.some((w) => w.includes(query.trim()))) return true;
        }
      }
      return false;
    });
    return [...list].sort((a, b) => {
      if (sortBy === "translations")
        return b.translations.length - a.translations.length;
      const ra = Math.max(...a.translations.map((t) => t.averageRating));
      const rb = Math.max(...b.translations.map((t) => t.averageRating));
      return rb - ra;
    });
  }, [query, publisher, minRating, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          لیست کتاب‌ها
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو: نام کتاب، نویسنده، مترجم، ناشر، سال انتشار یا کلمه داخل نظرات..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">ناشر</label>
              <select
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">همه ناشرها</option>
                {allPublishers.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                حداقل امتیاز: {minRating === 0 ? "همه" : minRating}
              </label>
              <input
                type="range" min={0} max={5} step={1} value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full accent-yellow-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">مرتب‌سازی</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "rating" | "translations")}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="rating">بالاترین امتیاز</option>
                <option value="translations">بیشترین ترجمه</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {filtered.length} کتاب پیدا شد
          </p>
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">
            کتابی پیدا نشد. عبارت دیگری را امتحان کنید.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((book) => (
            <Link
              key={book.id}
              href={`/books/${book.id}`}
              className="block bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {book.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                نویسنده: {book.author}
              </p>
              <p className="text-gray-700 dark:text-gray-300 line-clamp-3 mb-4">
                {book.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                  {book.translations.length} ترجمه
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {book.originalTitle}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}