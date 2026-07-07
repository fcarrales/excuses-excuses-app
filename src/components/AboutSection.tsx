"use client";

import {
  APP_BUILD_STAGE,
  APP_NAME,
  APP_TAGLINE,
  APP_VERSION,
} from "@/lib/appInfo";

export default function AboutSection() {
  return (
    <section className="space-y-3" aria-labelledby="about-heading">
      <h3
        id="about-heading"
        className="text-xs font-bold uppercase tracking-wider text-violet-600"
      >
        About
      </h3>
      <div className="space-y-3 text-sm text-slate-700">
        <div>
          <p className="font-semibold text-slate-900">{APP_NAME}</p>
          <p className="text-violet-700">{APP_TAGLINE}</p>
          <p className="mt-1 text-xs text-slate-500">
            Version {APP_VERSION} · {APP_BUILD_STAGE}
          </p>
        </div>
        <div>
          <p className="font-medium text-slate-800">What this app does</p>
          <p className="mt-1 leading-relaxed">
            A local message assistant for awkward social situations, work
            messages, and school messages. Get polished, ready-to-send texts in
            English, Spanish, or Spanglish — everything stays on your device.
          </p>
        </div>
        <div>
          <p className="font-medium text-slate-800">What this app does not do</p>
          <ul className="mt-1 list-inside list-disc space-y-1 leading-relaxed">
            <li>Create fake proof or documents</li>
            <li>Generate official-looking records</li>
            <li>Require login or send your data to a server</li>
          </ul>
        </div>
        <p className="rounded-xl bg-violet-50 px-3 py-2.5 text-xs leading-relaxed text-violet-900">
          <strong>Safety note:</strong> This app helps write respectful
          messages. It refuses requests for fake proof, fake documents, or
          official-looking records.
        </p>
        <p className="text-xs text-slate-500">
          Install from your browser menu when supported (Share → Add to Home
          Screen on iOS, Install app in Chrome or Edge).
        </p>
      </div>
    </section>
  );
}
