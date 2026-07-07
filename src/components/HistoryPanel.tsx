"use client";

import ResultCard from "@/components/ResultCard";
import EmptyState from "@/components/EmptyState";
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
      <EmptyState
        icon="🕐"
        title="No history yet"
        description="Generated messages will appear here automatically."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-violet-900">
          History ({history.length})
        </h2>
        <button
          type="button"
          onClick={handleClearHistory}
          className="shrink-0 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
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
