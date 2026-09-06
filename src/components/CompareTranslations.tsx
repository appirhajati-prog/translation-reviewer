"use client";

import { useState } from "react";
import { Translation } from "@/types";

interface Props {
  translations: Translation[];
  originalText?: string;
}

export default function CompareTranslations({ translations, originalText }: Props) {
  const [selected, setSelected] = useState<string[]>([
    translations[0]?.id || "",
    translations[1]?.id || "",
  ]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const selectedTranslations = translations.filter((t) => selected.includes(t.id));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        ⚖️ مقایسه ترجمه‌ها (حداکثر ۲ مورد)
      </h3>

      {/* Translation Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {translations.map((t) => (
          <button
            key={t.id}
            onClick={() => toggle(t.id)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              selected.includes(t.id)
                ? "bg-purple-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {t.translatorName}
          </button>
        ))}
      </div>

      {/* Side-by-Side View */}
      <div className={`grid gap-4 ${selectedTranslations.length === 2 ? "md:grid-cols-2" : "grid-cols-1"}`}>
        {selectedTranslations.map((t) => (
          <div key={t.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-gray-900 dark:text-white">{t.translatorName}</h4>
              <span className="text-yellow-500 font-bold">{t.averageRating.toFixed(1)} ⭐</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {t.publisher} — {t.publishYear}
            </p>
            {t.sampleText && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded mb-3">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">نمونه ترجمه:</p>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{t.sampleText}</p>
              </div>
            )}
            {t.dimensionAverages && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "روانی", val: t.dimensionAverages.fluency },
                  { label: "وفاداری", val: t.dimensionAverages.fidelity },
                  { label: "خوانایی", val: t.dimensionAverages.readability },
                  { label: "ویرایش", val: t.dimensionAverages.editing },
                ].map((d) => (
                  <div key={d.label} className="flex justify-between bg-gray-50 dark:bg-gray-900/50 px-2 py-1 rounded">
                    <span className="text-gray-500 dark:text-gray-400">{d.label}</span>
                    <span className={`font-bold ${d.val >= 4.5 ? "text-green-600" : d.val >= 3.5 ? "text-yellow-600" : "text-red-500"}`}>
                      {d.val.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Original Text Reference */}
      {originalText && (
        <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">
            📖 متن اصلی (برای مقایسه)
          </h4>
          <p className="text-gray-800 dark:text-gray-200 italic leading-relaxed" dir="ltr">
            {originalText}
          </p>
        </div>
      )}
    </div>
  );
}