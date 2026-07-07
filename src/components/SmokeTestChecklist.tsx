"use client";

import { useState } from "react";
import {
  getSmokeTestChecklist,
  setSmokeTestItem,
  type SmokeTestId,
} from "@/lib/storage";

const ITEMS: { id: SmokeTestId; label: string }[] = [
  { id: "generate", label: "Generate message" },
  { id: "copy", label: "Copy message" },
  { id: "share", label: "Share message" },
  { id: "favorite", label: "Favorite message" },
  { id: "person", label: "Add saved person" },
  { id: "pack", label: "Use message pack" },
  { id: "preset", label: "Use style preset" },
  { id: "export", label: "Export backup" },
  { id: "import", label: "Import backup" },
  { id: "safety", label: "Safety block test" },
  { id: "pwa", label: "PWA install check" },
];

export default function SmokeTestChecklist() {
  const [checked, setChecked] = useState(() => getSmokeTestChecklist());
  const doneCount = ITEMS.filter((item) => checked[item.id]).length;

  function toggle(id: SmokeTestId) {
    const next = !checked[id];
    setSmokeTestItem(id, next);
    setChecked((prev) => ({ ...prev, [id]: next }));
  }

  return (
    <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-emerald-900">
          Beta smoke test
        </p>
        <span className="shrink-0 text-xs font-medium text-emerald-700">
          {doneCount}/{ITEMS.length}
        </span>
      </div>
      <p className="mb-3 text-xs text-emerald-900/80">
        Quick pre-release check before sharing the beta publicly.
      </p>
      <ul className="space-y-1">
        {ITEMS.map((item) => (
          <li key={item.id}>
            <label className="flex min-h-[40px] cursor-pointer items-center gap-3 rounded-lg px-1 py-1 hover:bg-white/50">
              <input
                type="checkbox"
                checked={checked[item.id]}
                onChange={() => toggle(item.id)}
                className="h-4 w-4 shrink-0 rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-800">{item.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
