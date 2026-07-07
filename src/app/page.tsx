"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import FavoritesPanel from "@/components/FavoritesPanel";
import Generator from "@/components/Generator";
import HistoryPanel from "@/components/HistoryPanel";
import MessagePacksPanel from "@/components/MessagePacksPanel";
import PeoplePanel from "@/components/PeoplePanel";
import SettingsPanel from "@/components/SettingsPanel";
import type { GeneratorPrefill, Tab } from "@/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("generator");
  const [refreshKey, setRefreshKey] = useState(0);
  const [generatorPrefill, setGeneratorPrefill] =
    useState<GeneratorPrefill | null>(null);
  const [prefillKey, setPrefillKey] = useState(0);

  function handleDataChange() {
    setRefreshKey((k) => k + 1);
  }

  function handleSelectPack(prefill: GeneratorPrefill) {
    setGeneratorPrefill(prefill);
    setPrefillKey((k) => k + 1);
    setActiveTab("generator");
  }

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "generator" && (
        <Generator
          key={prefillKey}
          initialPrefill={generatorPrefill}
          onFavoriteToggle={handleDataChange}
        />
      )}
      {activeTab === "people" && <PeoplePanel key={refreshKey} />}
      {activeTab === "packs" && (
        <MessagePacksPanel onSelectPack={handleSelectPack} />
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
