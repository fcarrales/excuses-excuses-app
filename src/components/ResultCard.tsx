"use client";

import { useState } from "react";
import type { HistoryEntry } from "@/types";
import { getStyleLabel } from "@/lib/messageTemplates";

interface ResultCardProps {
  entry: HistoryEntry;
  onToggleFavorite: (entry: HistoryEntry) => void;
}

export default function ResultCard({ entry, onToggleFavorite }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(entry.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = entry.message;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-700">
          {getStyleLabel(entry.label)}
        </span>
        <button
          type="button"
          onClick={() => onToggleFavorite(entry)}
          className={`rounded-lg p-2 transition-colors ${
            entry.isFavorite
              ? "text-amber-500 hover:text-amber-600"
              : "text-slate-400 hover:text-amber-500"
          }`}
          aria-label={entry.isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <span className="text-xl" aria-hidden>
            {entry.isFavorite ? "★" : "☆"}
          </span>
        </button>
      </div>
      <p className="mb-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
        {entry.message}
      </p>
      <button
        type="button"
        onClick={handleCopy}
        className="w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 active:bg-violet-800"
      >
        {copied ? "Copied!" : "Copy message"}
      </button>
    </article>
  );
}
