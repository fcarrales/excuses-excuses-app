"use client";

export default function SafetySection() {
  return (
    <section className="space-y-3" aria-labelledby="safety-heading">
      <h3
        id="safety-heading"
        className="text-xs font-bold uppercase tracking-wider text-violet-600"
      >
        Safety guidelines
      </h3>
      <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-slate-700">
        <li>Use the app to communicate respectfully and honestly.</li>
        <li>Do not use it to impersonate people or organizations.</li>
        <li>Do not use it to create fake proof, receipts, or doctor notes.</li>
        <li>Do not use it for official documents or records.</li>
        <li>
          If the situation is serious, be honest and contact the right person
          directly.
        </li>
      </ul>
    </section>
  );
}
