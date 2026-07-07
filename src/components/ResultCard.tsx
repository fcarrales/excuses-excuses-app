"use client";

import { useCallback, useState } from "react";
import type { HistoryEntry } from "@/types";
import { getStyleLabel } from "@/lib/messageTemplates";
import { canNativeShare, copyToClipboard, shareMessage } from "@/lib/clipboard";
import Toast from "@/components/Toast";
import MessageMetadata from "@/components/MessageMetadata";

interface ResultCardProps {
  entry: HistoryEntry;
  onToggleFavorite: (entry: HistoryEntry) => void;
}

export default function ResultCard({ entry, onToggleFavorite }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  async function handleCopy() {
    const ok = await copyToClipboard(entry.message);
    if (ok) {
      setCopied(true);
      showToast("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast("Could not copy — try selecting the text");
    }
  }

  async function handleShare() {
    const result = await shareMessage(entry.message);
    if (result === "shared") {
      showToast("Shared!");
    } else if (result === "copied") {
      setCopied(true);
      showToast("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-md shadow-slate-200/50 transition-shadow hover:shadow-lg hover:shadow-violet-100/40">
        <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50/80 to-indigo-50/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-700 shadow-sm">
              {getStyleLabel(entry.label)}
            </span>
            <button
              type="button"
              onClick={() => onToggleFavorite(entry)}
              className={`rounded-xl p-2 transition-all active:scale-95 ${
                entry.isFavorite
                  ? "bg-amber-50 text-amber-500 hover:text-amber-600"
                  : "text-slate-400 hover:bg-amber-50 hover:text-amber-500"
              }`}
              aria-label={
                entry.isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <span className="text-xl" aria-hidden>
                {entry.isFavorite ? "★" : "☆"}
              </span>
            </button>
          </div>
        </div>
        <div className="p-4">
          <MessageMetadata entry={entry} />
          <p className="mb-4 mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800">
            {entry.message}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="min-h-[44px] flex-1 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet-700 active:scale-[0.98]"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="min-h-[44px] flex-1 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition-all hover:bg-violet-100 active:scale-[0.98]"
            >
              {canNativeShare() ? "Share" : "Share / Copy"}
            </button>
          </div>
        </div>
      </article>
      <Toast message={toast} visible={Boolean(toast)} onHide={() => setToast("")} />
    </>
  );
}
