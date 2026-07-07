"use client";

import { useCallback, useState } from "react";
import OptionSelector from "@/components/OptionSelector";
import ResultCard from "@/components/ResultCard";
import LaunchCard from "@/components/LaunchCard";
import DailyMessageCard from "@/components/DailyMessageCard";
import InstallPrompt from "@/components/InstallPrompt";
import {
  generateMessages,
  LANGUAGE_OPTIONS,
  RECIPIENT_OPTIONS,
  requiresImproveInput,
  SITUATION_OPTIONS,
  TONE_OPTIONS,
} from "@/lib/messageTemplates";
import { QUICK_MODES } from "@/lib/quickModes";
import { detectRiskyContent, getSafetyResponse } from "@/lib/safety";
import {
  addToHistory,
  getDefaultStylePreset,
  getSavedPeople,
  getSettings,
  getStylePresets,
  seedExampleStylePresets,
  toggleFavorite,
} from "@/lib/storage";
import type {
  GeneratedMessage,
  GeneratorPrefill,
  HistoryEntry,
  Language,
  Recipient,
  Situation,
  Tone,
} from "@/types";

interface GeneratorProps {
  onFavoriteToggle: () => void;
  initialPrefill?: GeneratorPrefill | null;
}

export default function Generator({
  onFavoriteToggle,
  initialPrefill,
}: GeneratorProps) {
  seedExampleStylePresets();
  const defaultPreset = getDefaultStylePreset();
  const settings = getSettings();

  const [situation, setSituation] = useState<Situation>(
    () => initialPrefill?.situation ?? "running-late",
  );
  const [recipient, setRecipient] = useState<Recipient>(
    () => initialPrefill?.recipient ?? "friend",
  );
  const [tone, setTone] = useState<Tone>(
    () => initialPrefill?.tone ?? defaultPreset?.tone ?? settings.defaultTone,
  );
  const [language, setLanguage] = useState<Language>(
    () =>
      initialPrefill?.language ??
      defaultPreset?.language ??
      settings.defaultLanguage,
  );
  const [details, setDetails] = useState(() => initialPrefill?.details ?? "");
  const [selectedPersonId, setSelectedPersonId] = useState<string>("");
  const [selectedPresetId, setSelectedPresetId] = useState(
    () => defaultPreset?.id ?? "",
  );
  const [activeQuickMode, setActiveQuickMode] = useState<string | null>(null);
  const [results, setResults] = useState<HistoryEntry[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [variationSeed, setVariationSeed] = useState(0);
  const [improvePrompt, setImprovePrompt] = useState(false);
  const [safetyBlock, setSafetyBlock] = useState<{
    warning: string;
    safeExample: string;
  } | null>(null);

  const savedPeople = getSavedPeople();
  const stylePresets = getStylePresets();
  const selectedPerson = savedPeople.find((p) => p.id === selectedPersonId);
  const selectedPreset = stylePresets.find((p) => p.id === selectedPresetId);

  const applySavedPerson = useCallback((personId: string) => {
    setSelectedPersonId(personId);
    if (!personId) return;
    const person = getSavedPeople().find((p) => p.id === personId);
    if (!person) return;
    setRecipient(person.relationship);
    setTone(person.defaultTone);
    setLanguage(person.defaultLanguage);
    setActiveQuickMode(null);
  }, []);

  const applyQuickMode = useCallback((modeId: string) => {
    const mode = QUICK_MODES.find((m) => m.id === modeId);
    if (!mode) return;
    setActiveQuickMode(modeId);
    setSituation(mode.situation);
    setRecipient(mode.recipient);
    setTone(mode.tone);
    setSelectedPersonId("");
  }, []);

  const applyStylePreset = useCallback((presetId: string) => {
    setSelectedPresetId(presetId);
    if (!presetId) return;
    const preset = getStylePresets().find((p) => p.id === presetId);
    if (!preset) return;
    setTone(preset.tone);
    setLanguage(preset.language);
    setActiveQuickMode(null);
  }, []);

  const personName = selectedPerson?.name;
  const personNotes = selectedPerson?.notes;

  function runGenerate(seed: number) {
    setSafetyBlock(null);
    setImprovePrompt(false);

    if (requiresImproveInput(situation, details)) {
      setImprovePrompt(true);
      setResults([]);
      setHasGenerated(false);
      return;
    }

    const textToCheck = [details, personNotes].filter(Boolean).join(" ");
    if (textToCheck.trim() && detectRiskyContent(textToCheck)) {
      const response = getSafetyResponse(language);
      setSafetyBlock({
        warning: response.warning,
        safeExample: response.safeExample,
      });
      setResults([]);
      setHasGenerated(true);
      return;
    }

    const generated = generateMessages({
      situation,
      recipient,
      tone,
      language,
      details: details.trim() || undefined,
      variationSeed: seed,
      personName,
      personNotes,
      favoritePhrases: selectedPreset?.favoritePhrases,
      avoidPhrases: selectedPreset?.avoidPhrases,
    });

    const entries: HistoryEntry[] = generated.map((msg: GeneratedMessage) => ({
      ...msg,
      isFavorite: false,
    }));

    entries.forEach((entry) => addToHistory(entry));
    setResults(entries);
    setHasGenerated(true);
    setVariationSeed(seed);
  }

  function handleGenerate() {
    runGenerate(0);
  }

  function handleRegenerate() {
    runGenerate(variationSeed + 1);
  }

  function handleStartOver() {
    setDetails("");
    setResults([]);
    setHasGenerated(false);
    setImprovePrompt(false);
    setSafetyBlock(null);
    setVariationSeed(0);
  }

  function handleToggleFavorite(entry: HistoryEntry) {
    const updated = toggleFavorite(entry);
    setResults((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r)),
    );
    onFavoriteToggle();
  }

  return (
    <div className="space-y-6">
      <InstallPrompt />
      <LaunchCard />
      <DailyMessageCard language={language} onFavorite={onFavoriteToggle} />

      <section className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-violet-900">
          What do you need help saying?
        </h2>
        <p className="text-sm text-slate-600">
          Your message assistant for awkward moments — polite replies in seconds.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-700">Quick modes</h3>
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {QUICK_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => applyQuickMode(mode.id)}
              className={`flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all active:scale-95 ${
                activeQuickMode === mode.id
                  ? "border-violet-500 bg-violet-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-violet-300"
              }`}
            >
              <span aria-hidden>{mode.icon}</span>
              {mode.label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-6 rounded-2xl border border-white/70 bg-white/90 p-5 shadow-md shadow-violet-100/30 backdrop-blur-sm">
        {stylePresets.length > 0 && (
          <div className="space-y-2">
            <label
              htmlFor="style-preset"
              className="text-sm font-semibold text-slate-700"
            >
              Style preset
            </label>
            <select
              id="style-preset"
              value={selectedPresetId}
              onChange={(e) => applyStylePreset(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30"
            >
              <option value="">None — choose manually</option>
              {stylePresets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                  {p.isDefault ? " (default)" : ""}
                </option>
              ))}
            </select>
            {selectedPreset?.description && (
              <p className="text-xs text-violet-600">{selectedPreset.description}</p>
            )}
          </div>
        )}

        {savedPeople.length > 0 && (
          <div className="space-y-2">
            <label
              htmlFor="saved-person"
              className="text-sm font-semibold text-slate-700"
            >
              Use saved person
            </label>
            <select
              id="saved-person"
              value={selectedPersonId}
              onChange={(e) => applySavedPerson(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30"
            >
              <option value="">None — choose manually</option>
              {savedPeople.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({RECIPIENT_OPTIONS.find((r) => r.value === p.relationship)?.label})
                </option>
              ))}
            </select>
            {selectedPerson && (
              <p className="text-xs text-violet-600">
                Using {selectedPerson.name}&apos;s defaults
                {selectedPerson.notes ? ` — ${selectedPerson.notes}` : ""}
              </p>
            )}
          </div>
        )}

        <OptionSelector
          label="Situation"
          options={SITUATION_OPTIONS}
          value={situation}
          onChange={(v) => {
            setSituation(v);
            setImprovePrompt(false);
            setActiveQuickMode(null);
          }}
        />

        <OptionSelector
          label="Who is this for?"
          options={RECIPIENT_OPTIONS}
          value={recipient}
          onChange={(v) => {
            setRecipient(v);
            setActiveQuickMode(null);
          }}
          columns={4}
        />

        <OptionSelector
          label="Tone"
          options={TONE_OPTIONS}
          value={tone}
          onChange={(v) => {
            setTone(v);
            setActiveQuickMode(null);
          }}
          columns={3}
        />

        <div className="space-y-3">
          <OptionSelector
            label="Language"
            options={LANGUAGE_OPTIONS}
            value={language}
            onChange={setLanguage}
            columns={3}
          />
          <p className="text-xs text-slate-500">
            Spanish and Spanglish are built in.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="details"
            className="text-sm font-semibold text-slate-700"
          >
            {situation === "improve"
              ? "Paste or type your message"
              : "Add details (optional)"}
          </label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => {
              setDetails(e.target.value);
              setImprovePrompt(false);
              setSafetyBlock(null);
            }}
            placeholder={
              situation === "improve"
                ? "Paste the message you want to improve…"
                : "Example: I'm too tired to go but I don't want to sound rude"
            }
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30"
          />
          <p className="text-xs text-slate-500">
            {situation === "improve"
              ? "We'll rewrite your message into three polished versions."
              : "Add just enough detail to make the message sound like you."}
          </p>
        </div>

        {improvePrompt && (
          <div
            role="alert"
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            Paste or type the message you want to improve first — then hit
            Generate.
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          {hasGenerated && (
            <button
              type="button"
              onClick={handleStartOver}
              className="min-h-[48px] flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98]"
            >
              Start over
            </button>
          )}
          <button
            type="button"
            onClick={handleGenerate}
            className="min-h-[48px] flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98]"
          >
            Generate messages
          </button>
        </div>
      </section>

      {safetyBlock && (
        <section className="space-y-4">
          <div
            role="alert"
            className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm"
          >
            <p className="text-sm font-semibold text-amber-900">
              {safetyBlock.warning}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-amber-800">
              Try something like this instead:
            </p>
            <p className="mt-2 rounded-xl bg-white/80 p-4 text-sm leading-relaxed text-slate-800">
              {safetyBlock.safeExample}
            </p>
          </div>
        </section>
      )}

      {hasGenerated && results.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-violet-900">
              Your messages
            </h3>
            <button
              type="button"
              onClick={handleRegenerate}
              className="shrink-0 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 transition-all hover:bg-violet-100 active:scale-[0.98]"
            >
              Regenerate
            </button>
          </div>
          <div className="space-y-4">
            {results.map((entry) => (
              <ResultCard
                key={entry.id}
                entry={entry}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
