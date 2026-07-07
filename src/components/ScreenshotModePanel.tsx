"use client";

import { useState } from "react";
import {
  isDemoDataLoaded,
  isScreenshotModeEnabled,
  loadDemoData,
  setScreenshotModeEnabled,
} from "@/lib/storage";
import Toast from "@/components/Toast";

interface ScreenshotModePanelProps {
  onChange: () => void;
}

export default function ScreenshotModePanel({
  onChange,
}: ScreenshotModePanelProps) {
  const [enabled, setEnabled] = useState(() => isScreenshotModeEnabled());
  const [toast, setToast] = useState("");

  function handleToggle() {
    const next = !enabled;
    setScreenshotModeEnabled(next);
    setEnabled(next);
    if (next) {
      if (!isDemoDataLoaded()) {
        loadDemoData();
        setToast("Screenshot Mode on — demo data loaded for clean captures.");
      } else {
        setToast("Screenshot Mode on — using demo data for captures.");
      }
    } else {
      setToast("Screenshot Mode off.");
    }
    onChange();
  }

  return (
    <section className="space-y-4" aria-labelledby="screenshot-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3
          id="screenshot-heading"
          className="text-xs font-bold uppercase tracking-wider text-violet-600"
        >
          Screenshot mode
        </h3>
        {enabled && (
          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-800">
            Screenshot
          </span>
        )}
      </div>

      <p className="text-sm text-slate-600">
        Prepares the app for marketing screenshots. Loads safe demo data,
        reduces debug clutter, and never deletes your real data.
      </p>

      <label className="flex min-h-[44px] cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <span className="text-sm font-medium text-slate-800">
          Enable Screenshot Mode
        </span>
        <input
          type="checkbox"
          role="switch"
          checked={enabled}
          onChange={handleToggle}
          className="h-5 w-9 shrink-0 cursor-pointer accent-violet-600"
          aria-label="Toggle Screenshot Mode"
        />
      </label>

      {enabled && (
        <ul className="rounded-xl border border-sky-200/80 bg-sky-50/60 px-4 py-3 text-xs leading-relaxed text-sky-900">
          <li>Demo people, favorites, and presets are shown</li>
          <li>QA debug panels are hidden</li>
          <li>Your private messages are not displayed</li>
          <li>Turn off anytime — your real data stays intact</li>
        </ul>
      )}

      <Toast message={toast} visible={Boolean(toast)} onHide={() => setToast("")} />
    </section>
  );
}
