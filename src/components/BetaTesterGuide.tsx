"use client";

import { useState } from "react";
import {
  getBetaChecklist,
  setBetaChecklistItem,
  type BetaChecklistId,
} from "@/lib/storage";

const CHECKLIST: { id: BetaChecklistId; label: string }[] = [
  { id: "generate", label: "Generate a message" },
  { id: "spanish", label: "Try Spanish" },
  { id: "spanglish", label: "Try Spanglish" },
  { id: "favorite", label: "Save a favorite" },
  { id: "person", label: "Add a saved person" },
  { id: "pack", label: "Try a message pack" },
  { id: "preset", label: "Use a style preset" },
  { id: "export", label: "Export backup" },
  { id: "import", label: "Import backup" },
  { id: "safety", label: "Test safety block (e.g. fake doctor note)" },
  { id: "install", label: "Install as PWA if supported" },
];

export default function BetaTesterGuide() {
  const [checked, setChecked] = useState(() => getBetaChecklist());

  function toggle(id: BetaChecklistId) {
    const next = !checked[id];
    setBetaChecklistItem(id, next);
    setChecked((prev) => ({ ...prev, [id]: next }));
  }

  const doneCount = CHECKLIST.filter((item) => checked[item.id]).length;

  return (
    <section className="space-y-4" aria-labelledby="beta-guide-heading">
      <h3
        id="beta-guide-heading"
        className="text-xs font-bold uppercase tracking-wider text-violet-600"
      >
        Beta tester guide
      </h3>

      <div className="space-y-3 text-sm leading-relaxed text-slate-700">
        <p>
          Thanks for helping test Excuses, Excuses! Try the flows below and tell
          us what feels confusing, broken, or missing.
        </p>

        <div>
          <p className="font-medium text-slate-800">What to try</p>
          <ul className="mt-1 list-inside list-disc space-y-1">
            <li>Generate messages in English, Spanish, and Spanglish</li>
            <li>Save people, favorites, and style presets</li>
            <li>Use message packs and rewrite buttons on results</li>
            <li>Export a backup before clearing data</li>
          </ul>
        </div>

        <div>
          <p className="font-medium text-slate-800">What to report</p>
          <ul className="mt-1 list-inside list-disc space-y-1">
            <li>Buttons that don&apos;t work or are hard to tap</li>
            <li>Messages that sound wrong or too long</li>
            <li>Layout issues on your phone size</li>
            <li>Backup import/export problems</li>
          </ul>
        </div>

        <p className="rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
          <strong>Before clearing data:</strong> Settings → Your data → Export
          backup. You can import it later on the same or another browser.
        </p>

        <p className="text-xs text-slate-600">
          Send feedback from the Feedback section below — include your device and
          browser if you can.
        </p>
      </div>

      <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-violet-900">
            Tester checklist
          </p>
          <span className="shrink-0 text-xs font-medium text-violet-600">
            {doneCount}/{CHECKLIST.length}
          </span>
        </div>
        <ul className="space-y-2">
          {CHECKLIST.map((item) => (
            <li key={item.id}>
              <label className="flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg px-1 py-1.5 hover:bg-white/60">
                <input
                  type="checkbox"
                  checked={checked[item.id]}
                  onChange={() => toggle(item.id)}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-violet-300 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm text-slate-800">{item.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs leading-relaxed text-slate-600">
        <p className="font-semibold text-slate-700">Install notes</p>
        <ul className="mt-1 list-inside list-disc space-y-1">
          <li>
            Install prompts depend on your browser and device — not every phone
            shows one.
          </li>
          <li>
            <strong>iPhone:</strong> Safari → Share → Add to Home Screen.
          </li>
          <li>
            <strong>Desktop Chrome or Edge:</strong> Use the install icon in the
            address bar or the browser menu.
          </li>
        </ul>
      </div>
    </section>
  );
}
