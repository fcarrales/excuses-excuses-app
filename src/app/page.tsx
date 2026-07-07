"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import FavoritesPanel from "@/components/FavoritesPanel";
import Generator from "@/components/Generator";
import HistoryPanel from "@/components/HistoryPanel";
import SettingsPanel from "@/components/SettingsPanel";
import type { Tab } from "@/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("generator");
  const [refreshKey, setRefreshKey] = useState(0);

  function handleDataChange() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "generator" && (
        <Generator onFavoriteToggle={handleDataChange} />
      )}
      {activeTab === "favorites" && (
        <FavoritesPanel key={refreshKey} />
      )}
      {activeTab === "history" && (
        <HistoryPanel
          key={refreshKey}
          onHistoryCleared={handleDataChange}
        />
      )}
      {activeTab === "settings" && (
        <SettingsPanel onSettingsChange={handleDataChange} />
      )}
    </AppShell>
  );
}
