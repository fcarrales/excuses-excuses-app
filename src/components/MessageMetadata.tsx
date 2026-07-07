"use client";

import type { HistoryEntry } from "@/types";
import {
  getLanguageLabel,
  getRecipientLabel,
  getSituationLabel,
  getToneLabel,
} from "@/lib/messageTemplates";

interface MessageMetadataProps {
  entry: HistoryEntry;
}

export default function MessageMetadata({ entry }: MessageMetadataProps) {
  const chips = [
    getLanguageLabel(entry.language),
    getToneLabel(entry.tone),
    getSituationLabel(entry.situation),
    getRecipientLabel(entry.recipient),
  ];

  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((label) => (
        <span
          key={label}
          className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500"
        >
          {label}
        </span>
      ))}
    </div>
  );
}
