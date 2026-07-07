"use client";

import ResultCard from "@/components/ResultCard";
import { getFavorites, removeFavorite, toggleFavorite } from "@/lib/storage";
import type { HistoryEntry } from "@/types";
import { useState } from "react";

export default function FavoritesPanel() {
  const [favorites, setFavorites] = useState(() => getFavorites());

  function handleToggleFavorite(entry: HistoryEntry) {
    if (entry.isFavorite) {
      removeFavorite(entry.id);
    } else {
      toggleFavorite(entry);
    }
    setFavorites(getFavorites());
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center">
        <span className="mb-3 text-4xl" aria-hidden>
          ⭐
        </span>
        <h2 className="text-lg font-semibold text-slate-800">No favorites yet</h2>
        <p className="mt-2 max-w-xs text-sm text-slate-600">
          Tap the star on any generated message to save it here for quick access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-violet-900">
          Favorites ({favorites.length})
        </h2>
      </div>
      <div className="space-y-4">
        {favorites.map((entry) => (
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
