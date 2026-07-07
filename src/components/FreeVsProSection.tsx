export default function FreeVsProSection() {
  return (
    <section className="space-y-4" aria-labelledby="free-pro-heading">
      <div>
        <h3
          id="free-pro-heading"
          className="text-xs font-bold uppercase tracking-wider text-violet-600"
        >
          Free beta vs Future Pro
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Future Pro ideas only — no payments, no locked features in this beta.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4">
          <p className="text-sm font-bold text-emerald-900">Free beta includes</p>
          <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-emerald-900/90">
            <li>Template-based messages</li>
            <li>English, Spanish, Spanglish</li>
            <li>Favorites and history</li>
            <li>Saved people</li>
            <li>Style presets</li>
            <li>Message Coach</li>
            <li>Backup / export</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-sm font-bold text-slate-700">Future Pro ideas</p>
          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
            Not active — brainstorming only
          </p>
          <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-600">
            <li>AI-powered custom rewrites</li>
            <li>Unlimited advanced tones</li>
            <li>Cloud backup</li>
            <li>Premium message packs</li>
            <li>Android / iOS app features</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
