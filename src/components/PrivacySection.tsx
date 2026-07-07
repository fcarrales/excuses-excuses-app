"use client";

export default function PrivacySection() {
  return (
    <section className="space-y-3" aria-labelledby="privacy-heading">
      <h3
        id="privacy-heading"
        className="text-xs font-bold uppercase tracking-wider text-violet-600"
      >
        Privacy
      </h3>
      <div className="space-y-2 text-sm leading-relaxed text-slate-700">
        <p>
          Messages are generated <strong>locally on your device</strong> in this
          version. Nothing is sent to our servers because there is no backend.
        </p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>No login required</li>
          <li>No ads</li>
          <li>No tracking or analytics in this beta</li>
        </ul>
        <p>
          Saved people, favorites, history, settings, and style presets are
          stored only in <strong>this browser</strong> using localStorage.
        </p>
        <p className="rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
          Clearing your browser data or using a different device may delete your
          saved content. Use Export backup in Settings to keep a copy.
        </p>
      </div>
    </section>
  );
}
