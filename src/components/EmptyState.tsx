"use client";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300/80 bg-white/70 px-6 py-16 text-center shadow-sm">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-3xl" aria-hidden>
        {icon}
      </span>
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  );
}
