"use client";

import { useMemo, useState } from "react";
import ResultCard from "@/components/ResultCard";
import EmptyState from "@/components/EmptyState";
import FilterChips from "@/components/FilterChips";
import SearchInput from "@/components/SearchInput";
import {
  filterHistory,
  HISTORY_FILTER_OPTIONS,
} from "@/lib/messageFilters";
import { clearHistory, getHistory, toggleFavorite } from "@/lib/storage";
import type { HistoryEntry, HistoryFilter } from "@/types";

interface HistoryPanelProps {
  onHistoryCleared: () => void;
}

export default function HistoryPanel({ onHistoryCleared }: HistoryPanelProps) {
  const [history, setHistory] = useState(() => getHistory());
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => filterHistory(history, filter, search),
    [history, filter, search],
  );

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
          className="min-h-[44px] shrink-0 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          Clear
        </button>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search history…" />

      <FilterChips
        options={HISTORY_FILTER_OPTIONS}
        value={filter}
        onChange={setFilter}
      />

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No messages match your filter.
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((entry) => (
            <ResultCard
              key={entry.id}
              entry={entry}
              onToggleFavorite={handleToggleFavorite}
              showCoachChip
            />
          ))}
        </div>
      )}
    </div>
  );
}
