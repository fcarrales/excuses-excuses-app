"use client";

import { useEffect, useState } from "react";
import { APP_VERSION, INTENDED_APP_URL } from "@/lib/appInfo";
import { getAppHealth } from "@/lib/appHealth";
import { hasPublicAppUrl } from "@/lib/env";
import {
  getPreReleaseChecklist,
  setPreReleaseItem,
  type PreReleaseId,
} from "@/lib/storage";

type DisplayCheckId =
  | PreReleaseId
  | "version"
  | "appUrl"
  | "feedbackEmail"
  | "sw"
  | "lint"
  | "build";

interface CheckItem {
  id: DisplayCheckId;
  label: string;
  autoReady?: boolean;
  live?: boolean;
}

const MANUAL_ITEMS: Omit<CheckItem, "autoReady" | "live">[] = [
  { id: "privacyRoute", label: "Privacy route works (/privacy)" },
  { id: "safetyRoute", label: "Safety route works (/safety)" },
  { id: "manifestRoute", label: "Manifest route works (/manifest.webmanifest)" },
  { id: "install", label: "PWA install prompt checked" },
  { id: "backup", label: "Export/import tested" },
  { id: "share", label: "Share beta text tested" },
  { id: "safetyBlock", label: "Safety block tested (fake-proof requests)" },
  { id: "mobile", label: "Mobile layout checked (390px)" },
  {
    id: "domain",
    label: `Domain connected (${INTENDED_APP_URL.replace("https://", "")})`,
  },
];

export default function PreReleaseChecklist() {
  const [checked, setChecked] = useState(() => getPreReleaseChecklist());
  const [swRegistered, setSwRegistered] = useState(false);
  const health = getAppHealth();

  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    navigator.serviceWorker.getRegistration().then((reg) => {
      setSwRegistered(Boolean(reg));
    });
  }, []);

  const staticItems: CheckItem[] = [
    { id: "version", label: `Version visible (v${APP_VERSION})`, autoReady: true },
    {
      id: "appUrl",
      label: "App URL configured (NEXT_PUBLIC_APP_URL)",
      live: health.hasAppUrl,
    },
    {
      id: "feedbackEmail",
      label: "Feedback email configured (NEXT_PUBLIC_FEEDBACK_EMAIL)",
      live: health.hasFeedbackEmail,
    },
    {
      id: "sw",
      label: "PWA service worker registered",
      live: swRegistered,
    },
    { id: "lint", label: "npm run lint passes (verified at release)", autoReady: true },
    { id: "build", label: "npm run build passes (verified at release)", autoReady: true },
  ];

  const allItems: CheckItem[] = [...staticItems, ...MANUAL_ITEMS];
  const readyCount = allItems.filter(isItemReady).length;

  function toggle(id: PreReleaseId) {
    const next = !checked[id];
    setPreReleaseItem(id, next);
    setChecked((prev) => ({ ...prev, [id]: next }));
  }

  function isItemReady(item: CheckItem): boolean {
    if (item.autoReady) return true;
    if (item.live !== undefined) return item.live;
    return checked[item.id as PreReleaseId];
  }

  return (
    <section className="space-y-3" aria-labelledby="pre-release-heading">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3
          id="pre-release-heading"
          className="text-xs font-bold uppercase tracking-wider text-violet-600"
        >
          Pre-release checklist
        </h3>
        <span className="text-xs font-medium text-slate-500">
          {readyCount}/{allItems.length} ready
        </span>
      </div>
      <p className="text-xs text-slate-600">
        Final checks before beta launch on {INTENDED_APP_URL}.
      </p>

      {!hasPublicAppUrl() && (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Set <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_APP_URL</code>{" "}
          to {INTENDED_APP_URL} in Vercel (or <code className="rounded bg-amber-100 px-1">.env.local</code>)
          before public sharing.
        </p>
      )}

      <ul className="space-y-2">
        {allItems.map((item) => {
          const isReady = isItemReady(item);

          if (item.autoReady || item.live !== undefined) {
            return (
              <li
                key={item.id}
                className="flex min-h-[40px] items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm"
              >
                <span
                  className={`mt-0.5 shrink-0 ${isReady ? "text-emerald-600" : "text-slate-400"}`}
                  aria-hidden
                >
                  {isReady ? "✓" : "○"}
                </span>
                <span className="text-slate-800">{item.label}</span>
              </li>
            );
          }

          return (
            <li key={item.id}>
              <label className="flex min-h-[40px] cursor-pointer items-start gap-3 rounded-lg bg-slate-50 px-3 py-2 hover:bg-slate-100/80">
                <input
                  type="checkbox"
                  checked={checked[item.id as PreReleaseId]}
                  onChange={() => toggle(item.id as PreReleaseId)}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-violet-300 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm text-slate-800">{item.label}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
