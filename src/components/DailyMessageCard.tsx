"use client";

import { useMemo, useState } from "react";
import { getDailyMessage } from "@/lib/dailyMessage";
import { copyToClipboard } from "@/lib/clipboard";
import { addToHistory, toggleFavorite } from "@/lib/storage";
import type { HistoryEntry, Language } from "@/types";
import Toast from "@/components/Toast";

interface DailyMessageCardProps {
  language: Language;
  onFavorite?: () => void;
}

export default function DailyMessageCard({
  language,
  onFavorite,
}: DailyMessageCardProps) {
  const daily = useMemo(() => getDailyMessage(language), [language]);
  const [copied, setCopied] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [toast, setToast] = useState("");

  async function handleCopy() {
    const ok = await copyToClipboard(daily.message);
    if (ok) {
      setCopied(true);
      setToast("Copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleFavorite() {
    const entry: HistoryEntry = {
      id: `daily-${Date.now()}`,
      label: "natural",
      message: daily.message,
      situation: daily.situation,
      recipient: "friend",
      tone: daily.tone,
      language: daily.language,
      createdAt: Date.now(),
      isFavorite: false,
    };
    addToHistory(entry);
    toggleFavorite(entry);
    setFavorited(true);
    setToast("Saved to favorites!");
    onFavorite?.();
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Daily message
            </p>
            <span className="mt-0.5 inline-block rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
              {daily.category}
            </span>
          </div>
          <span className="text-lg" aria-hidden>
            ☀️
          </span>
        </div>
        <p className="text-sm leading-relaxed text-slate-800">{daily.message}</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleCopy}
            className="min-h-[44px] flex-1 rounded-xl bg-amber-600 px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-amber-700 active:scale-[0.98]"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            type="button"
            onClick={handleFavorite}
            disabled={favorited}
            className="min-h-[44px] flex-1 rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm font-semibold text-amber-800 transition-all hover:bg-amber-50 active:scale-[0.98] disabled:opacity-60"
          >
            {favorited ? "Saved ★" : "Favorite"}
          </button>
        </div>
      </div>
      <Toast message={toast} visible={Boolean(toast)} onHide={() => setToast("")} />
    </>
  );
}
