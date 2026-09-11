"use client";

import { useState } from "react";
import { isApiEnabled, postReview } from "@/lib/api";

interface Props {
  translationId: string;
  onSubmitted?: () => void;
}

export default function ReviewForm({ translationId, onSubmitted }: Props) {
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [strengths, setStrengths] = useState("");
  const [weaknesses, setWeaknesses] = useState("");
  const [dimensions, setDimensions] = useState({ fluency: 3, fidelity: 3, readability: 3, editing: 3 });
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isApiEnabled) {
      alert("نظر شما ثبت شد! (در نسخه فعلی فقط نمایشی است — بک‌اند وصل نیست)");
      setComment("");
      setRating(5);
      setStrengths("");
      setWeaknesses("");
      setDimensions({ fluency: 3, fidelity: 3, readability: 3, editing: 3 });
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      await postReview(translationId, {
        user_name: userName.trim() || "کاربر ناشناس",
        rating,
        fluency: dimensions.fluency,
        fidelity: dimensions.fidelity,
        readability: dimensions.readability,
        editing: dimensions.editing,
        comment: comment.trim(),
        strengths: strengths.trim(),
        weaknesses: weaknesses.trim(),
      });
      setComment("");
      setRating(5);
      setStrengths("");
      setWeaknesses("");
      setUserName("");
      setDimensions({ fluency: 3, fidelity: 3, readability: 3, editing: 3 });
      setStatus("idle");
      onSubmitted?.();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "خطا در ثبت نظر");
    }
  };

  const dimensionLabels = {
    fluency: "روانی متن",
    fidelity: "وفاداری به اصل",
    readability: "خوانایی",
    editing: "ویرایش و نگارش",
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <h4 className="font-bold text-gray-900 dark:text-white mb-4">ثبت نظر و امتیاز جدید</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نام شما</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="مثال: علی محمدی"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">امتیاز کلی</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} ستاره</option>
            ))}
          </select>
        </div>

        {/* Multi-dimensional Ratings */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          {(Object.keys(dimensionLabels) as Array<keyof typeof dimensionLabels>).map((key) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                {dimensionLabels[key]}: {dimensions[key]}/5
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={dimensions[key]}
                onChange={(e) => setDimensions({ ...dimensions, [key]: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نقاط قوت (با کاما جدا کنید)</label>
          <input
            type="text"
            value={strengths}
            onChange={(e) => setStrengths(e.target.value)}
            placeholder="مثال: روانی متن، وفاداری به اصل"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نقاط ضعف (با کاما جدا کنید)</label>
          <input
            type="text"
            value={weaknesses}
            onChange={(e) => setWeaknesses(e.target.value)}
            placeholder="مثال: جملات طولانی، حذفیات"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نظر شما</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={3}
            placeholder="تجربه خود از این ترجمه را بنویسید..."
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          />
        </div>
        <button type="submit" disabled={status === "sending"} className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium">
          {status === "sending" ? "در حال ثبت..." : "ثبت نظر"}
        </button>
        {status === "error" && (
          <p className="text-sm text-red-600 dark:text-red-400">خطا: {message}</p>
        )}
        {!isApiEnabled && (
          <p className="text-xs text-gray-400 text-center">حالت نمایشی — برای ذخیره واقعی NEXT_PUBLIC_API_URL را ست کنید.</p>
        )}
      </form>
    </div>
  );
}