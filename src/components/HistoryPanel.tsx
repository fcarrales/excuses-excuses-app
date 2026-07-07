"use client";

import ResultCard from "@/components/ResultCard";
import { clearHistory, getHistory, toggleFavorite } from "@/lib/storage";
import type { HistoryEntry } from "@/types";
import { useState } from "react";

interface HistoryPanelProps {
  onHistoryCleared: () => void;
}

export default function HistoryPanel({ onHistoryCleared }: HistoryPanelProps) {
  const [history, setHistory] = useState(() => getHistory());

  function handleClearHistory() {
    if (
      history.length > 0 &&
      window.confirm("Clear all message history? This cannot be undone.")
    ) {
      clearHistory();
      setHistory([]);
      onHistoryCleared();
    }
  }

  function handleToggleFavorite(entry: HistoryEntry) {
    toggleFavorite(entry);
    setHistory(getHistory());
    onHistoryCleared();
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center">
        <span className="mb-3 text-4xl" aria-hidden>
          🕐
        </span>
        <h2 className="text-lg font-semibold text-slate-800">No history yet</h2>
        <p className="mt-2 max-w-xs text-sm text-slate-600">
          Generated messages are saved here automatically so you can find them
          later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-violet-900">
          History ({history.length})
        </h2>
        <button
          type="button"
          onClick={handleClearHistory}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          Clear history
        </button>
      </div>
      <div className="space-y-4">
        {history.map((entry) => (
          <ResultCard
            key={entry.id}
            entry={entry}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
