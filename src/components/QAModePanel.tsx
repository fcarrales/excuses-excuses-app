"use client";

import { useState } from "react";
import { APP_VERSION } from "@/lib/appInfo";
import {
  getQaStats,
  isQAModeEnabled,
  setQAModeEnabled,
  type QaStats,
} from "@/lib/storage";
import DemoDataTools from "@/components/DemoDataTools";

interface QAModePanelProps {
  onChange: () => void;
}

export default function QAModePanel({ onChange }: QAModePanelProps) {
  const [enabled, setEnabled] = useState(() => isQAModeEnabled());
  const [stats, setStats] = useState<QaStats>(() => getQaStats());

  function refresh() {
    setStats(getQaStats());
  }

  function handleToggle() {
    const next = !enabled;
    setQAModeEnabled(next);
    setEnabled(next);
    if (next) refresh();
    onChange();
  }

  return (
    <section className="space-y-4" aria-labelledby="qa-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3
          id="qa-heading"
          className="text-xs font-bold uppercase tracking-wider text-violet-600"
        >
          QA mode
        </h3>
        {enabled && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
            QA
          </span>
        )}
      </div>

      <p className="text-sm text-slate-600">
        Local-only debug view for beta testing. Shows counts and status — never
        your private message text.
      </p>

      <label className="flex min-h-[44px] cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <span className="text-sm font-medium text-slate-800">Enable QA mode</span>
        <input
          type="checkbox"
          role="switch"
          checked={enabled}
          onChange={handleToggle}
          className="h-5 w-9 shrink-0 cursor-pointer accent-violet-600"
          aria-label="Toggle QA mode"
        />
      </label>

      {enabled && (
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-4 text-sm">
            <p className="font-semibold text-amber-900">QA status</p>
            <dl className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <div className="flex justify-between gap-2 rounded-lg bg-white/70 px-3 py-2">
                <dt className="text-slate-500">App version</dt>
                <dd className="font-mono font-medium text-slate-800">
                  {APP_VERSION}
                </dd>
              </div>
              <div className="flex justify-between gap-2 rounded-lg bg-white/70 px-3 py-2">
                <dt className="text-slate-500">localStorage</dt>
                <dd className="font-medium text-slate-800">
                  {stats.localStorageAvailable ? "OK" : "Unavailable"}
                </dd>
              </div>
              <div className="flex justify-between gap-2 rounded-lg bg-white/70 px-3 py-2">
                <dt className="text-slate-500">Favorites</dt>
                <dd className="font-mono font-medium text-slate-800">
                  {stats.favoritesCount}
                </dd>
              </div>
              <div className="flex justify-between gap-2 rounded-lg bg-white/70 px-3 py-2">
                <dt className="text-slate-500">History</dt>
                <dd className="font-mono font-medium text-slate-800">
                  {stats.historyCount}
                </dd>
              </div>
              <div className="flex justify-between gap-2 rounded-lg bg-white/70 px-3 py-2">
                <dt className="text-slate-500">Saved people</dt>
                <dd className="font-mono font-medium text-slate-800">
                  {stats.peopleCount}
                </dd>
              </div>
              <div className="flex justify-between gap-2 rounded-lg bg-white/70 px-3 py-2">
                <dt className="text-slate-500">Style presets</dt>
                <dd className="font-mono font-medium text-slate-800">
                  {stats.presetsCount}
                </dd>
              </div>
              <div className="flex justify-between gap-2 rounded-lg bg-white/70 px-3 py-2">
                <dt className="text-slate-500">Settings saved</dt>
                <dd className="font-medium text-slate-800">
                  {stats.settingsSaved ? "Yes" : "No"}
                </dd>
              </div>
              <div className="flex justify-between gap-2 rounded-lg bg-white/70 px-3 py-2">
                <dt className="text-slate-500">Onboarding dismissed</dt>
                <dd className="font-medium text-slate-800">
                  {stats.onboardingDismissed ? "Yes" : "No"}
                </dd>
              </div>
              <div className="flex justify-between gap-2 rounded-lg bg-white/70 px-3 py-2">
                <dt className="text-slate-500">Install dismissed</dt>
                <dd className="font-medium text-slate-800">
                  {stats.installDismissed ? "Yes" : "No"}
                </dd>
              </div>
              <div className="flex justify-between gap-2 rounded-lg bg-white/70 px-3 py-2 sm:col-span-2">
                <dt className="text-slate-500">Demo data loaded</dt>
                <dd className="font-medium text-slate-800">
                  {stats.demoLoaded ? "Yes" : "No"}
                </dd>
              </div>
            </dl>
          </div>

          <DemoDataTools
            onChange={() => {
              refresh();
              onChange();
            }}
          />
        </div>
      )}
    </section>
  );
}
