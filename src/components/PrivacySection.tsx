"use client";

import Link from "next/link";
import { PRIVACY_SUMMARY } from "@/lib/legalContent";

export default function PrivacySection() {
  return (
    <section className="space-y-3" aria-labelledby="privacy-heading">
      <h3
        id="privacy-heading"
        className="text-xs font-bold uppercase tracking-wider text-violet-600"
      >
        {PRIVACY_SUMMARY.title}
      </h3>
      <div className="space-y-2 text-sm leading-relaxed text-slate-700">
        <p>{PRIVACY_SUMMARY.intro}</p>
        <ul className="list-inside list-disc space-y-1.5">
          {PRIVACY_SUMMARY.points.slice(0, 6).map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <p className="rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
          Clearing your browser data or using a different device may delete your
          saved content. Use Export backup in Settings to keep a copy.
        </p>
        <Link
          href="/privacy"
          className="inline-block text-sm font-semibold text-violet-600 hover:text-violet-800"
        >
          Read full privacy summary →
        </Link>
      </div>
    </section>
  );
}
