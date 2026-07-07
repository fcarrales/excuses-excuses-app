"use client";

import { useState } from "react";
import {
  clearDemoData,
  isDemoDataLoaded,
  loadDemoData,
} from "@/lib/storage";
import Toast from "@/components/Toast";

interface DemoDataToolsProps {
  onChange: () => void;
}

export default function DemoDataTools({ onChange }: DemoDataToolsProps) {
  const [loaded, setLoaded] = useState(() => isDemoDataLoaded());
  const [toast, setToast] = useState("");

  function handleLoad() {
    const counts = loadDemoData();
    setLoaded(true);
    setToast(
      `Demo data loaded: ${counts.people} people, ${counts.favorites} favorites, ${counts.history} history, ${counts.presets} presets.`,
    );
    onChange();
  }

  function handleClear() {
    if (
      window.confirm(
        "Remove demo sample data? Your own entries stay safe.",
      )
    ) {
      clearDemoData();
      setLoaded(false);
      setToast("Demo data cleared");
      onChange();
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <div>
        <p className="text-sm font-semibold text-slate-800">Demo data</p>
        <p className="mt-1 text-xs text-slate-600">
          Safe sample people, favorites, history, and presets for testing. Uses
          stable IDs — loading again replaces demo entries without duplicates.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleLoad}
          className="min-h-[44px] flex-1 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 active:scale-[0.98]"
        >
          Load demo data
        </button>
        {loaded && (
          <button
            type="button"
            onClick={handleClear}
            className="min-h-[44px] flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 active:scale-[0.98]"
          >
            Clear demo data
          </button>
        )}
      </div>

      <Toast message={toast} visible={Boolean(toast)} onHide={() => setToast("")} />
    </div>
  );
}
