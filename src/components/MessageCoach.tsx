"use client";

import { useState } from "react";
import type { CoachAnalysis } from "@/lib/messageCoach";
import { getScoreColor } from "@/lib/messageCoach";

interface MessageCoachProps {
  analysis: CoachAnalysis;
  compact?: boolean;
}

export default function MessageCoach({ analysis, compact }: MessageCoachProps) {
  const [expanded, setExpanded] = useState(!compact);

  const scoreClass = getScoreColor(analysis.overallScore);

  if (compact && !expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${scoreClass}`}
      >
        Coach {analysis.overallScore}
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-indigo-50/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
            Message Coach
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${scoreClass}`}
          >
            {analysis.overallScore}
          </span>
        </div>
        {compact && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            Hide
          </button>
        )}
      </div>
      <p className="mt-1.5 text-sm font-medium text-slate-800">
        {analysis.shortFeedback}
      </p>
      {analysis.tips.length > 0 && (
        <ul className="mt-2 space-y-1">
          {analysis.tips.map((tip) => (
            <li
              key={tip}
              className="flex items-start gap-1.5 text-xs text-slate-600"
            >
              <span className="mt-0.5 text-violet-400" aria-hidden>
                ✓
              </span>
              {tip}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
