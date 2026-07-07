"use client";

import { dismissLaunchCard, isLaunchCardDismissed, isScreenshotModeEnabled } from "@/lib/storage";
import { useEffect, useState } from "react";

export default function LaunchCard() {
  const [visible, setVisible] = useState(
    () => !isLaunchCardDismissed() && !isScreenshotModeEnabled(),
  );

  useEffect(() => {
    function onScreenshotChange() {
      if (isScreenshotModeEnabled()) setVisible(false);
    }
    window.addEventListener("excuses-screenshot-change", onScreenshotChange);
    return () =>
      window.removeEventListener("excuses-screenshot-change", onScreenshotChange);
  }, []);

  if (!visible || isScreenshotModeEnabled()) return null;

  function handleDismiss() {
    dismissLaunchCard();
    setVisible(false);
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-200/80 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-5 shadow-md shadow-violet-100/40">
      <div
        className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-200/25"
        aria-hidden
      />
      <div className="relative space-y-4">
        <div className="pr-8">
          <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
            Message assistant
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            <strong className="text-violet-900">Excuses, Excuses!</strong> helps
            you write respectful, ready-to-send messages for awkward moments.
          </p>
        </div>

        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex gap-2.5">
            <span className="text-base" aria-hidden>
              ✨
            </span>
            <span>
              <strong className="text-slate-800">Pick a situation</strong> —
              running late, canceling, work, and more
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-base" aria-hidden>
              🎯
            </span>
            <span>
              <strong className="text-slate-800">Choose the tone</strong> —
              casual, professional, or soft
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-base" aria-hidden>
              📋
            </span>
            <span>
              <strong className="text-slate-800">Copy or share</strong> a
              polished message
            </span>
          </li>
        </ul>

        <p className="rounded-lg bg-white/70 px-3 py-2 text-xs text-slate-600">
          No fake proof. No fake documents. Just better messages.
        </p>

        <button
          type="button"
          onClick={handleDismiss}
          className="min-h-[44px] w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 active:scale-[0.98]"
        >
          Got it — let&apos;s go
        </button>
      </div>
    </div>
  );
}
