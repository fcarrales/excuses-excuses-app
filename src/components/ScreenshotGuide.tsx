const SCREENS = [
  {
    screen: "Home / Generator",
    caption: "Pick a situation and get 3 polished messages",
  },
  {
    screen: "Generated message with Message Coach",
    caption: "Message Coach helps you keep it clear and respectful",
  },
  {
    screen: "Saved People",
    caption: "Save people and personalize tone",
  },
  {
    screen: "Message Packs",
    caption: "Curated starting points for common situations",
  },
  {
    screen: "Settings / Privacy",
    caption: "Everything stays on your device",
  },
  {
    screen: "PWA install prompt",
    caption: "Install it like an app",
  },
] as const;

const CAPTIONS = [
  "Pick a situation and get 3 polished messages",
  "Save people and personalize tone",
  "Message Coach helps you keep it clear and respectful",
  "Spanish and Spanglish built in",
  "Install it like an app",
] as const;

export default function ScreenshotGuide() {
  return (
    <section className="space-y-4" aria-labelledby="screenshot-guide-heading">
      <h3
        id="screenshot-guide-heading"
        className="text-xs font-bold uppercase tracking-wider text-violet-600"
      >
        App screenshot guide
      </h3>
      <p className="text-xs text-slate-600">
        Enable Screenshot Mode in Settings, then capture these screens at 390px
        width for marketing.
      </p>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">Screens to capture</p>
        <ul className="space-y-2">
          {SCREENS.map((item) => (
            <li
              key={item.screen}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
            >
              <p className="font-medium text-slate-800">{item.screen}</p>
              <p className="mt-0.5 text-xs text-violet-600">{item.caption}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-3">
        <p className="text-xs font-semibold text-violet-900">
          Suggested captions
        </p>
        <ul className="mt-2 space-y-1 text-xs text-slate-700">
          {CAPTIONS.map((caption) => (
            <li key={caption} className="flex gap-2">
              <span className="text-violet-500" aria-hidden>
                “
              </span>
              <span>{caption}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
