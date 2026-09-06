"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { mockBooks } from "@/data/mockData";
import TranslationCard from "@/components/TranslationCard";
import CompareTranslations from "@/components/CompareTranslations";

interface Props {
  params: { id: string };
}

export default function BookDetailPage({ params }: Props) {
  const book = mockBooks.find((b) => b.id === params.id);
  const [showCompare, setShowCompare] = useState(false);

  if (!book) {
    notFound();
  }

  const sortedTranslations = [...book.translations].sort(
    (a, b) => b.averageRating - a.averageRating
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Book Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            {book.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            {book.originalTitle} — {book.author}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {book.description}
          </p>

          {/* Original Sample Text */}
          {book.originalSampleText && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">
                📖 نمونه متن اصلی
              </h3>
              <p className="text-gray-800 dark:text-gray-200 italic leading-relaxed" dir="ltr">
                {book.originalSampleText}
              </p>
            </div>
          )}

          {/* Compare Button */}
          {book.translations.length >= 2 && (
            <button
              onClick={() => setShowCompare(!showCompare)}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              {showCompare ? "❌ بستن مقایسه" : "⚖️ مقایسه کنار هم ترجمه‌ها"}
            </button>
          )}
        </div>

        {/* Side-by-Side Comparison */}
        {showCompare && (
          <div className="mb-8">
            <CompareTranslations
              translations={sortedTranslations}
              originalText={book.originalSampleText}
            />
          </div>
        )}

        {/* Translations List */}
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          ترجمه‌های موجود ({book.translations.length})
        </h2>

        <div className="space-y-6">
          {sortedTranslations.map((translation, index) => (
            <TranslationCard
              key={translation.id}
              translation={translation}
              rank={index + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}