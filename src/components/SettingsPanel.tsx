"use client";

import OptionSelector from "@/components/OptionSelector";
import StylePresetsPanel from "@/components/StylePresetsPanel";
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
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-violet-900">Settings</h2>

      <section className="space-y-5 rounded-2xl border border-white/70 bg-white/90 p-5 shadow-md shadow-violet-100/30 backdrop-blur-sm">
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-violet-600">
            Defaults
          </h3>
          <div className="space-y-6">
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
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-md shadow-violet-100/30 backdrop-blur-sm">
        <StylePresetsPanel onChange={onSettingsChange} />
      </section>

      <section className="space-y-3 rounded-2xl border border-white/70 bg-white/90 p-5 shadow-md shadow-violet-100/30 backdrop-blur-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-violet-600">
          Your data
        </h3>
        <p className="text-sm text-slate-600">
          Everything stays on your device. Nothing is sent to a server.
        </p>
        <button
          type="button"
          onClick={handleClearHistory}
          className="min-h-[44px] w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 active:scale-[0.98]"
        >
          Clear history
        </button>
        <button
          type="button"
          onClick={handleClearFavorites}
          className="min-h-[44px] w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 active:scale-[0.98]"
        >
          Clear favorites
        </button>
      </section>
    </div>
  );
}
