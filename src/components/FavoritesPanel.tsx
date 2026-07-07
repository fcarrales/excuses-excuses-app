"use client";

import ResultCard from "@/components/ResultCard";
import EmptyState from "@/components/EmptyState";
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
      <EmptyState
        icon="⭐"
        title="No favorites yet"
        description="Save messages you like and they will show up here."
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-violet-900">
        Favorites ({favorites.length})
      </h2>
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
