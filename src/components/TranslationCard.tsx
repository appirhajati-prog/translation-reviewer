"use client";

import { useState } from "react";
import { Translation } from "@/types";
import ReviewForm from "./ReviewForm";

interface Props {
  translation: Translation;
  rank: number;
}

export default function TranslationCard({ translation, rank }: Props) {
  const [showReviews, setShowReviews] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="bg-yellow-400 text-yellow-900 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
              #{rank}
            </span>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                ترجمه {translation.translatorName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {translation.publisher} — {translation.publishYear}
              </p>
            </div>
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold text-yellow-500">
              {translation.averageRating.toFixed(1)} ⭐
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {translation.reviewCount} نظر
            </p>
            {translation.dimensionAverages && (
              <div className="mt-2 text-[10px] text-gray-500 dark:text-gray-400 space-y-0.5">
                <div>روانی: {translation.dimensionAverages.fluency.toFixed(1)}</div>
                <div>وفاداری: {translation.dimensionAverages.fidelity.toFixed(1)}</div>
                <div>خوانایی: {translation.dimensionAverages.readability.toFixed(1)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Dimension Averages */}
        {translation.dimensionAverages && (
          <div className="grid grid-cols-4 gap-2 mb-4 text-center">
            {[
              { label: "روانی", val: translation.dimensionAverages.fluency },
              { label: "وفاداری", val: translation.dimensionAverages.fidelity },
              { label: "خوانایی", val: translation.dimensionAverages.readability },
              { label: "ویرایش", val: translation.dimensionAverages.editing },
            ].map((d) => (
              <div key={d.label} className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded text-xs">
                <span className="block text-gray-500 dark:text-gray-400">{d.label}</span>
                <span className={`font-bold ${d.val >= 4.5 ? "text-green-600" : d.val >= 3.5 ? "text-yellow-600" : "text-red-500"}`}>
                  {d.val.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Sample translated text */}
        {translation.sampleText && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3 mb-4">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
              نمونه‌ای از این ترجمه:
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
              {translation.sampleText}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setShowReviews(!showReviews)}
            className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            {showReviews ? "بستن نظرات" : `مشاهده ${translation.reviews.length} نظر و ثبت امتیاز`}
          </button>
        </div>
      </div>

      {showReviews && (
        <div className="p-6 bg-gray-50 dark:bg-gray-900">
          {translation.reviews.length > 0 ? (
            <div className="space-y-4 mb-8">
              {translation.reviews.map((review) => (
                <div key={review.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{review.userName}</span>
                    <span className="text-yellow-500 text-sm">{"⭐".repeat(review.rating)}</span>
                  </div>
                  {review.dimensions && (
                    <div className="grid grid-cols-4 gap-1 mb-2 text-[10px]">
                      <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">روانی {review.dimensions.fluency}</span>
                      <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">وفاداری {review.dimensions.fidelity}</span>
                      <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">خوانایی {review.dimensions.readability}</span>
                      <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">ویرایش {review.dimensions.editing}</span>
                    </div>
                  )}
                  <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">{review.comment}</p>
                  {(review.strengths.length > 0 || review.weaknesses.length > 0) && (
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {review.strengths.length > 0 && (
                        <div>
                          <span className="text-green-600 dark:text-green-400 font-medium">✅ نقاط قوت:</span>
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mt-1">
                            {review.strengths.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                      {review.weaknesses.length > 0 && (
                        <div>
                          <span className="text-red-600 dark:text-red-400 font-medium">❌ نقاط ضعف:</span>
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mt-1">
                            {review.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2">{review.createdAt}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4 mb-8">هنوز نظری ثبت نشده. اولین نفر باشید!</p>
          )}
          <ReviewForm
            key={refreshKey}
            translationId={translation.id}
            onSubmitted={() => setRefreshKey((k) => k + 1)}
          />
        </div>
      )}
    </div>
  );
}