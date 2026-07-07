"use client";

import { useCallback, useState } from "react";
import OptionSelector from "@/components/OptionSelector";
import ResultCard from "@/components/ResultCard";
import WelcomeCard from "@/components/WelcomeCard";
import {
  generateMessages,
  LANGUAGE_OPTIONS,
  RECIPIENT_OPTIONS,
  requiresImproveInput,
  SITUATION_OPTIONS,
  TONE_OPTIONS,
} from "@/lib/messageTemplates";
import { detectRiskyContent, getSafetyResponse } from "@/lib/safety";
import { addToHistory, getSettings, toggleFavorite } from "@/lib/storage";
import type {
  GeneratedMessage,
  HistoryEntry,
  Language,
  Recipient,
  Situation,
  Tone,
} from "@/types";

interface GeneratorProps {
  onFavoriteToggle: () => void;
}

export default function Generator({ onFavoriteToggle }: GeneratorProps) {
  const [situation, setSituation] = useState<Situation>("running-late");
  const [recipient, setRecipient] = useState<Recipient>("friend");
  const [tone, setTone] = useState<Tone>(() => getSettings().defaultTone);
  const [language, setLanguage] = useState<Language>(
    () => getSettings().defaultLanguage,
  );
  const [details, setDetails] = useState("");
  const [results, setResults] = useState<HistoryEntry[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [variationSeed, setVariationSeed] = useState(0);
  const [improvePrompt, setImprovePrompt] = useState(false);
  const [safetyBlock, setSafetyBlock] = useState<{
    warning: string;
    safeExample: string;
  } | null>(null);

  const runGenerate = useCallback(
    (seed: number) => {
      setSafetyBlock(null);
      setImprovePrompt(false);

      if (requiresImproveInput(situation, details)) {
        setImprovePrompt(true);
        setResults([]);
        setHasGenerated(false);
        return;
      }

      if (details.trim() && detectRiskyContent(details)) {
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
      });

      const entries: HistoryEntry[] = generated.map((msg: GeneratedMessage) => ({
        ...msg,
        isFavorite: false,
      }));

      entries.forEach((entry) => addToHistory(entry));
      setResults(entries);
      setHasGenerated(true);
      setVariationSeed(seed);
    },
    [situation, recipient, tone, language, details],
  );

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
      <WelcomeCard />

      <section className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-violet-900">
          What do you need help saying?
        </h2>
        <p className="text-sm text-slate-600">
          Pick a situation, choose your tone, and get ready-to-send messages.
        </p>
      </section>

      <section className="space-y-6 rounded-2xl border border-white/70 bg-white/90 p-5 shadow-md shadow-violet-100/30 backdrop-blur-sm">
        <OptionSelector
          label="Situation"
          options={SITUATION_OPTIONS}
          value={situation}
          onChange={(v) => {
            setSituation(v);
            setImprovePrompt(false);
          }}
        />

        <OptionSelector
          label="Who is this for?"
          options={RECIPIENT_OPTIONS}
          value={recipient}
          onChange={setRecipient}
          columns={4}
        />

        <OptionSelector
          label="Tone"
          options={TONE_OPTIONS}
          value={tone}
          onChange={setTone}
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
