"use client";

import { useCallback, useState } from "react";
import OptionSelector from "@/components/OptionSelector";
import ResultCard from "@/components/ResultCard";
import {
  generateMessages,
  LANGUAGE_OPTIONS,
  RECIPIENT_OPTIONS,
  SITUATION_OPTIONS,
  TONE_OPTIONS,
} from "@/lib/messageTemplates";
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

  const handleGenerate = useCallback(() => {
    const generated = generateMessages({
      situation,
      recipient,
      tone,
      language,
      details: details.trim() || undefined,
    });

    const entries: HistoryEntry[] = generated.map((msg: GeneratedMessage) => ({
      ...msg,
      isFavorite: false,
    }));

    entries.forEach((entry) => addToHistory(entry));
    setResults(entries);
    setHasGenerated(true);
  }, [situation, recipient, tone, language, details]);

  function handleToggleFavorite(entry: HistoryEntry) {
    const updated = toggleFavorite(entry);
    setResults((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r)),
    );
    onFavoriteToggle();
  }

  return (
    <div className="space-y-8">
      <section className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-violet-900">
          What do you need help saying?
        </h2>
        <p className="text-sm text-slate-600">
          Pick a situation, choose your tone, and get ready-to-send messages.
        </p>
      </section>

      <section className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm space-y-6">
        <OptionSelector
          label="Situation"
          options={SITUATION_OPTIONS}
          value={situation}
          onChange={setSituation}
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

        <OptionSelector
          label="Language"
          options={LANGUAGE_OPTIONS}
          value={language}
          onChange={setLanguage}
          columns={3}
        />

        <div className="space-y-2">
          <label
            htmlFor="details"
            className="text-sm font-semibold text-slate-700"
          >
            Add details (optional)
          </label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Example: I'm too tired to go but I don't want to sound rude"
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30"
          />
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98]"
        >
          Generate messages
        </button>
      </section>

      {hasGenerated && results.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-violet-900">
            Your messages
          </h3>
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
