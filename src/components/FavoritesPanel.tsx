"use client";

import { useMemo, useState } from "react";
import ResultCard from "@/components/ResultCard";
import EmptyState from "@/components/EmptyState";
import FilterChips from "@/components/FilterChips";
import SearchInput from "@/components/SearchInput";
import {
  FAVORITE_FILTER_OPTIONS,
  filterFavorites,
} from "@/lib/messageFilters";
import { getFavorites, removeFavorite, toggleFavorite } from "@/lib/storage";
import type { FavoriteFilter, HistoryEntry } from "@/types";

export default function FavoritesPanel() {
  const [favorites, setFavorites] = useState(() => getFavorites());
  const [filter, setFilter] = useState<FavoriteFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => filterFavorites(favorites, filter, search),
    [favorites, filter, search],
  );

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

      <SearchInput value={search} onChange={setSearch} placeholder="Search favorites…" />

      <FilterChips
        options={FAVORITE_FILTER_OPTIONS}
        value={filter}
        onChange={setFilter}
      />

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No favorites match your filter.
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
