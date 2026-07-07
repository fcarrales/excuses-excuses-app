"use client";

import { RELEASE_NOTES } from "@/lib/releaseNotes";

export default function ReleaseNotesSection() {
  return (
    <section className="space-y-3" aria-labelledby="release-notes-heading">
      <h3
        id="release-notes-heading"
        className="text-xs font-bold uppercase tracking-wider text-violet-600"
      >
        Release notes
      </h3>
      <div className="space-y-4">
        {RELEASE_NOTES.map((note) => (
          <article
            key={note.version}
            className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <p className="font-bold text-slate-900">v{note.version}</p>
              <span className="text-xs text-slate-500">{note.date}</span>
            </div>
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-relaxed text-slate-700">
              {note.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
