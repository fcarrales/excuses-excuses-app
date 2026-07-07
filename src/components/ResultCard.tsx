"use client";

import { useCallback, useMemo, useState } from "react";
import type { HistoryEntry } from "@/types";
import { getStyleLabel } from "@/lib/messageTemplates";
import { canNativeShare, copyToClipboard, shareMessage } from "@/lib/clipboard";
import { analyzeMessage, getScoreColor } from "@/lib/messageCoach";
import {
  REWRITE_ACTIONS,
  rewriteMessage,
  type RewriteAction,
} from "@/lib/messageRewrites";
import Toast from "@/components/Toast";
import MessageMetadata from "@/components/MessageMetadata";
import MessageCoach from "@/components/MessageCoach";
import TextPreview from "@/components/TextPreview";

interface ResultCardProps {
  entry: HistoryEntry;
  onToggleFavorite: (entry: HistoryEntry) => void;
  showCoachChip?: boolean;
}

export default function ResultCard({
  entry,
  onToggleFavorite,
  showCoachChip = false,
}: ResultCardProps) {
  const [message, setMessage] = useState(entry.message);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showCoach, setShowCoach] = useState(true);

  const analysis = useMemo(
    () => analyzeMessage(message, entry.tone, entry.language),
    [message, entry.tone, entry.language],
  );

  const currentEntry: HistoryEntry = {
    ...entry,
    message,
    coachScore: analysis.overallScore,
  };

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  async function handleCopy() {
    const ok = await copyToClipboard(message);
    if (ok) {
      setCopied(true);
      showToast("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast("Could not copy — try selecting the text");
    }
  }

  async function handleShare() {
    const result = await shareMessage(message);
    if (result === "shared") {
      showToast("Shared!");
    } else if (result === "copied") {
      setCopied(true);
      showToast("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleRewrite(action: RewriteAction) {
    const revised = rewriteMessage(message, action, entry.language);
    setMessage(revised);
    showToast("Message updated");
  }

  function handleFavorite() {
    onToggleFavorite(currentEntry);
  }

  const scoreClass = getScoreColor(analysis.overallScore);
  const displayScore = entry.coachScore ?? analysis.overallScore;

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-md shadow-slate-200/50 transition-shadow hover:shadow-lg hover:shadow-violet-100/40">
        <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50/80 to-indigo-50/50 px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-700 shadow-sm">
                {getStyleLabel(entry.label)}
              </span>
              {showCoachChip && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${scoreClass}`}
                >
                  {displayScore}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleFavorite}
              className={`rounded-xl p-2 transition-all active:scale-95 ${
                entry.isFavorite
                  ? "bg-amber-50 text-amber-500 hover:text-amber-600"
                  : "text-slate-400 hover:bg-amber-50 hover:text-amber-500"
              }`}
              aria-label={
                entry.isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <span className="text-xl" aria-hidden>
                {entry.isFavorite ? "★" : "☆"}
              </span>
            </button>
          </div>
        </div>
        <div className="space-y-3 p-4">
          <MessageMetadata entry={entry} />
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800">
            {message}
          </p>

          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="text-xs font-semibold text-violet-600 hover:text-violet-800"
          >
            {showPreview ? "Hide text preview" : "Preview as text"}
          </button>
          <TextPreview message={message} visible={showPreview} />

          {showCoach ? (
            <MessageCoach analysis={analysis} />
          ) : (
            <button
              type="button"
              onClick={() => setShowCoach(true)}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${scoreClass}`}
            >
              Coach {analysis.overallScore}
            </button>
          )}

          <div className="flex flex-wrap gap-1.5">
            {REWRITE_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => handleRewrite(action.id)}
                className="min-h-[36px] rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 transition-all hover:border-violet-300 hover:bg-violet-50 active:scale-95"
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopy}
              className="min-h-[44px] flex-1 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet-700 active:scale-[0.98]"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="min-h-[44px] flex-1 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition-all hover:bg-violet-100 active:scale-[0.98]"
            >
              {canNativeShare() ? "Share" : "Share / Copy"}
            </button>
          </div>
        </div>
      </article>
      <Toast message={toast} visible={Boolean(toast)} onHide={() => setToast("")} />
    </>
  );
}
