"use client";

import OptionSelector from "@/components/OptionSelector";
import StylePresetsPanel from "@/components/StylePresetsPanel";
import DataBackupSection from "@/components/DataBackupSection";
import AboutSection from "@/components/AboutSection";
import PrivacySection from "@/components/PrivacySection";
import SafetySection from "@/components/SafetySection";
import FeedbackSection from "@/components/FeedbackSection";
import BetaTesterGuide from "@/components/BetaTesterGuide";
import QAModePanel from "@/components/QAModePanel";
import ScreenshotModePanel from "@/components/ScreenshotModePanel";
import ReadinessChecklist from "@/components/ReadinessChecklist";
import FeatureHighlights from "@/components/FeatureHighlights";
import FreeVsProSection from "@/components/FreeVsProSection";
import ReleaseNotesSection from "@/components/ReleaseNotesSection";
import ShareInviteSection from "@/components/ShareInviteSection";
import {
  getSettings,
  isQAModeEnabled,
  isScreenshotModeEnabled,
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
  const [qaMode, setQaMode] = useState(() => isQAModeEnabled());
  const [screenshotMode, setScreenshotMode] = useState(() =>
    isScreenshotModeEnabled(),
  );

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

  function handleQaChange() {
    setQaMode(isQAModeEnabled());
    onSettingsChange();
  }

  function handleScreenshotChange() {
    setScreenshotMode(isScreenshotModeEnabled());
    onSettingsChange();
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-violet-900">Settings</h2>

      <section className="space-y-5 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-md shadow-violet-100/30 backdrop-blur-sm sm:p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-violet-600">
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
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-md shadow-violet-100/30 backdrop-blur-sm sm:p-5">
        <BetaTesterGuide />
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-md shadow-violet-100/30 backdrop-blur-sm sm:p-5">
        <ScreenshotModePanel onChange={handleScreenshotChange} />
      </section>

      {!screenshotMode && (
        <section className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-md shadow-violet-100/30 backdrop-blur-sm sm:p-5">
          <QAModePanel onChange={handleQaChange} />
        </section>
      )}

      <section className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-md shadow-violet-100/30 backdrop-blur-sm sm:p-5">
        <StylePresetsPanel onChange={onSettingsChange} />
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-md shadow-violet-100/30 backdrop-blur-sm sm:p-5">
        <DataBackupSection
          onDataChange={onSettingsChange}
          showDemoTools={!qaMode && !screenshotMode}
        />
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-md shadow-violet-100/30 backdrop-blur-sm sm:p-5">
        <ShareInviteSection />
      </section>

      <section className="space-y-5 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-md shadow-violet-100/30 backdrop-blur-sm sm:p-5">
        <AboutSection />
        <FeatureHighlights />
        <FreeVsProSection />
        <ReleaseNotesSection />
        <div className="border-t border-slate-100 pt-5">
          <ReadinessChecklist />
        </div>
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-md shadow-violet-100/30 backdrop-blur-sm sm:p-5">
        <PrivacySection />
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-md shadow-violet-100/30 backdrop-blur-sm sm:p-5">
        <SafetySection />
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-md shadow-violet-100/30 backdrop-blur-sm sm:p-5">
        <FeedbackSection />
      </section>
    </div>
  );
}
