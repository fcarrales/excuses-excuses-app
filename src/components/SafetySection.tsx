"use client";

import Link from "next/link";
import { SAFETY_SUMMARY } from "@/lib/legalContent";

export default function SafetySection() {
  return (
    <section className="space-y-3" aria-labelledby="safety-heading">
      <h3
        id="safety-heading"
        className="text-xs font-bold uppercase tracking-wider text-violet-600"
      >
        {SAFETY_SUMMARY.title}
      </h3>
      <p className="text-sm text-slate-700">{SAFETY_SUMMARY.intro}</p>
      <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-slate-700">
        {SAFETY_SUMMARY.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <Link
        href="/safety"
        className="inline-block text-sm font-semibold text-violet-600 hover:text-violet-800"
      >
        Read full safety policy →
      </Link>
    </section>
  );
}
