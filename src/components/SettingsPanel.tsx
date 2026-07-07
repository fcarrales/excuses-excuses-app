"use client";

import OptionSelector from "@/components/OptionSelector";
import {
  clearFavorites,
  clearHistory,
  getSettings,
  updateDefaultLanguage,
  updateDefaultTone,
} from "@/lib/storage";
import { LANGUAGE_OPTIONS, TONE_OPTIONS } from "@/lib/messageTemplates";
import type { Language, Tone } from "@/types";
import { useState } from "react";

interface SettingsPanelProps {
  onSettingsChange: () => void;
}

export default function SettingsPanel({ onSettingsChange }: SettingsPanelProps) {
  const [language, setLanguage] = useState<Language>(
    () => getSettings().defaultLanguage,
  );
  const [tone, setTone] = useState<Tone>(() => getSettings().defaultTone);

  function handleLanguageChange(value: Language) {
    setLanguage(value);
    updateDefaultLanguage(value);
    onSettingsChange();
  }

  function handleToneChange(value: Tone) {
    setTone(value);
    updateDefaultTone(value);
    onSettingsChange();
  }

  function handleClearHistory() {
    if (window.confirm("Clear all message history? This cannot be undone.")) {
      clearHistory();
      onSettingsChange();
    }
  }

  function handleClearFavorites() {
    if (window.confirm("Remove all favorites? This cannot be undone.")) {
      clearFavorites();
      onSettingsChange();
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-violet-900">Settings</h2>

      <section className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm space-y-6">
        <OptionSelector
          label="Default language"
          options={LANGUAGE_OPTIONS}
          value={language}
          onChange={handleLanguageChange}
          columns={3}
        />

        <OptionSelector
          label="Default tone"
          options={TONE_OPTIONS}
          value={tone}
          onChange={handleToneChange}
          columns={3}
        />
      </section>

      <section className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm space-y-3">
        <h3 className="text-sm font-semibold text-slate-700">Data</h3>
        <button
          type="button"
          onClick={handleClearHistory}
          className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
        >
          Clear history
        </button>
        <button
          type="button"
          onClick={handleClearFavorites}
          className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
        >
          Clear favorites
        </button>
      </section>

      <p className="text-center text-xs text-slate-500">
        All data is stored locally on your device. Nothing is sent to a server.
      </p>
    </div>
  );
}
