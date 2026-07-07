const FEATURES = [
  {
    icon: "✨",
    title: "Message Generator",
    description:
      "Pick a situation and get three polished, ready-to-send options.",
  },
  {
    icon: "🌎",
    title: "Spanish & Spanglish",
    description:
      "Natural bilingual messages built in — no extra setup needed.",
  },
  {
    icon: "👤",
    title: "Saved People",
    description:
      "Store names and defaults so replies match each relationship.",
  },
  {
    icon: "💬",
    title: "Message Coach",
    description:
      "Clarity and tone tips help keep messages clear and respectful.",
  },
  {
    icon: "🎨",
    title: "Style Presets",
    description:
      "Save your favorite tone and language combos for quick reuse.",
  },
  {
    icon: "📲",
    title: "PWA Install",
    description:
      "Add to your home screen for quick access — works offline too.",
  },
] as const;

export default function FeatureHighlights() {
  return (
    <section className="space-y-3" aria-labelledby="features-heading">
      <h3
        id="features-heading"
        className="text-xs font-bold uppercase tracking-wider text-violet-600"
      >
        Feature highlights
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-lg"
                aria-hidden
              >
                {feature.icon}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">{feature.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
