"use client";

import { useEffect, useState } from "react";
import { APP_VERSION } from "@/lib/appInfo";

interface ReadinessItem {
  id: string;
  label: string;
  ready: boolean;
  note?: string;
}

export default function ReadinessChecklist() {
  const [swRegistered, setSwRegistered] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    navigator.serviceWorker.getRegistration().then((reg) => {
      setSwRegistered(Boolean(reg));
    });
  }, []);

  const items: ReadinessItem[] = [
    { id: "manifest", label: "PWA manifest present", ready: true },
    {
      id: "sw",
      label: "Service worker registered",
      ready: swRegistered,
      note: swRegistered ? undefined : "May register after first visit",
    },
    { id: "privacy", label: "Privacy section present", ready: true },
    { id: "safety", label: "Safety section present", ready: true },
    { id: "backup", label: "Backup / export present", ready: true },
    { id: "no-backend", label: "No backend required", ready: true },
    { id: "no-api", label: "No API key required", ready: true },
    { id: "build", label: "Build passes (verified at release)", ready: true },
    {
      id: "version",
      label: `Version visible (v${APP_VERSION})`,
      ready: true,
    },
  ];

  const readyCount = items.filter((i) => i.ready).length;

  return (
    <section className="space-y-3" aria-labelledby="readiness-heading">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3
          id="readiness-heading"
          className="text-xs font-bold uppercase tracking-wider text-violet-600"
        >
          Production readiness
        </h3>
        <span className="text-xs font-medium text-slate-500">
          {readyCount}/{items.length} ready
        </span>
      </div>
      <p className="text-xs text-slate-600">
        Quick checklist for beta launch. Service worker status updates live in
        your browser.
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex min-h-[40px] items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm"
          >
            <span
              className={`mt-0.5 shrink-0 text-base ${item.ready ? "text-emerald-600" : "text-slate-400"}`}
              aria-hidden
            >
              {item.ready ? "✓" : "○"}
            </span>
            <div className="min-w-0">
              <span className="text-slate-800">{item.label}</span>
              {item.note && (
                <p className="text-xs text-slate-500">{item.note}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
