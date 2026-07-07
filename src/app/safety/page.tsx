import LegalPageShell from "@/components/LegalPageShell";
import { SAFETY_SUMMARY } from "@/lib/legalContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safety — Excuses, Excuses!",
  description: "Safety policy for the Excuses, Excuses! message assistant beta.",
};

export default function SafetyPage() {
  return (
    <LegalPageShell title={SAFETY_SUMMARY.title}>
      <article className="space-y-4 rounded-2xl border border-white/70 bg-white/90 p-5 text-sm leading-relaxed text-slate-700 shadow-md">
        <p>{SAFETY_SUMMARY.intro}</p>
        <ul className="list-inside list-disc space-y-2">
          {SAFETY_SUMMARY.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <p className="rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
          {SAFETY_SUMMARY.disclaimer}
        </p>
        <p className="text-xs text-slate-500">
          Last updated for beta v0.8.0. Not legal advice.
        </p>
      </article>
    </LegalPageShell>
  );
}
