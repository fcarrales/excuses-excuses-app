"use client";

import { MESSAGE_PACKS } from "@/lib/messagePacks";
import type { GeneratorPrefill } from "@/types";

interface MessagePacksPanelProps {
  onSelectPack: (prefill: GeneratorPrefill) => void;
}

export default function MessagePacksPanel({
  onSelectPack,
}: MessagePacksPanelProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-violet-900">Message Packs</h2>
        <p className="mt-1 text-sm text-slate-600">
          Curated starting points for common situations.
        </p>
      </div>

      <div className="space-y-3">
        {MESSAGE_PACKS.map((pack) => (
          <button
            key={pack.id}
            type="button"
            onClick={() => onSelectPack(pack.prefill)}
            className="w-full rounded-2xl border border-slate-200/60 bg-white p-4 text-left shadow-sm transition-all hover:border-violet-300 hover:shadow-md active:scale-[0.99] sm:p-5"
          >
            <div className="flex items-start gap-3">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-xl"
                aria-hidden
              >
                {pack.icon}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-900">{pack.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {pack.description}
                </p>
                <p className="mt-2 text-xs text-violet-600">
                  {pack.sampleUseCase}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
