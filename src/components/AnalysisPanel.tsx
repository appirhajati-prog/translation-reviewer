"use client";

import { useEffect, useRef, useState } from "react";
import {
  analyzeTranslation,
  getAnalysisJob,
  isApiEnabled,
  type AnalysisJob,
} from "@/lib/api";

interface Props {
  translationId: string;
  translatorName: string;
  onDone?: () => void;
}

/** Button + progress-traced panel: fetch web comments → score → save as reviews. */
export default function AnalysisPanel({ translationId, translatorName, onDone }: Props) {
  const [urlsText, setUrlsText] = useState("");
  const [job, setJob] = useState<AnalysisJob | null>(null);
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };

  useEffect(() => stopPolling, []);

  const poll = (jobId: number) => {
    stopPolling();
    timer.current = setInterval(async () => {
      try {
        const j = await getAnalysisJob(translationId, jobId);
        setJob(j);
        if (j.status === "done" || j.status === "error") {
          stopPolling();
          if (j.status === "done") onDone?.();
        }
      } catch (e) {
        stopPolling();
        setError(e instanceof Error ? e.message : "خطا در پیگیری تحلیل");
      }
    }, 2500);
  };

  const start = async () => {
    setError("");
    setJob(null);
    const urls = urlsText.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 5);
    try {
      const { job_id } = await analyzeTranslation(translationId, urls, 5);
      const j = await getAnalysisJob(translationId, job_id);
      setJob(j);
      poll(job_id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در شروع تحلیل");
    }
  };

  if (!isApiEnabled) {
    return (
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-200">
        تحلیل خودکار وب نیاز به بک‌اند دارد — <code dir="ltr">NEXT_PUBLIC_API_URL</code> را ست کنید.
      </div>
    );
  }

  return (
    <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-lg p-4">
      <h4 className="font-bold text-sm text-violet-900 dark:text-violet-200 mb-2">
        🤖 تحلیل خودکار نظرات وب درباره «{translatorName}»
      </h4>
      <p className="text-xs text-violet-700 dark:text-violet-300 mb-3 leading-relaxed">
        لینک صفحه‌های نظر (مثلاً فیدیبو/طاقچه/گودریدز/دیجی‌کالا/کتابراه) را بدهید — یا خالی بگذارید تا
        خودش در وب جستجو کند. فقط صفحات عمومی و مجاز (robots.txt) خوانده می‌شود.
      </p>
      <textarea
        value={urlsText}
        onChange={(e) => setUrlsText(e.target.value)}
        rows={2}
        dir="ltr"
        placeholder={"https://example.com/book-page-1\nhttps://example.com/book-page-2"}
        className="w-full text-left text-xs p-2 border border-violet-300 dark:border-violet-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-2"
      />
      <button
        onClick={start}
        disabled={job?.status === "pending" || job?.status === "running"}
        className="w-full py-2 px-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
      >
        {job?.status === "pending" || job?.status === "running"
          ? "⏳ در حال جستجو و تحلیل..."
          : "شروع تحلیل نظرات وب"}
      </button>
      {error && <p className="text-xs text-red-600 dark:text-red-400 mt-2">خطا: {error}</p>}
      {job && (
        <div className="text-xs mt-3 space-y-1 text-gray-700 dark:text-gray-300">
          <p>وضعیت: <b>{job.status === "done" ? "تمام شد ✅" : job.status === "error" ? "خطا ❌" : "در حال اجرا..."}</b></p>
          {job.status === "done" && (
            <>
              <p>نظرات پیدا شده: <b>{job.comments_found}</b> — میانگین: <b>{job.avg_rating} از ۵</b></p>
              <p className="leading-relaxed">{job.summary}</p>
            </>
          )}
          {job.status === "error" && <p className="text-red-600">علت: {job.error || "نامشخص"}</p>}
        </div>
      )}
    </div>
  );
}
