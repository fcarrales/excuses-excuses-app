"use client";

import { dismissOnboarding, isOnboardingDismissed } from "@/lib/storage";
import { useState } from "react";

export default function WelcomeCard() {
  const [visible, setVisible] = useState(() => !isOnboardingDismissed());

  if (!visible) return null;

  function handleDismiss() {
    dismissOnboarding();
    setVisible(false);
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-200/80 bg-gradient-to-br from-violet-50 to-indigo-50 p-5 shadow-md shadow-violet-100/50">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-violet-200/30" aria-hidden />
      <div className="relative space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
            Welcome
          </p>
          <h3 className="mt-1 text-lg font-bold text-violet-900">
            How it works
          </h3>
        </div>
        <ol className="space-y-2 text-sm text-slate-700">
          <li className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
              1
            </span>
            Pick a situation
          </li>
          <li className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
              2
            </span>
            Choose who it&apos;s for
          </li>
          <li className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
              3
            </span>
            Choose tone and language
          </li>
          <li className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
              4
            </span>
            Generate 3 ready-to-send options
          </li>
        </ol>
        <button
          type="button"
          onClick={handleDismiss}
          className="w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 active:scale-[0.98]"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
