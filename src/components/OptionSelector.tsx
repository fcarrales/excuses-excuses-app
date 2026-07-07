"use client";

interface OptionSelectorProps<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  columns?: 2 | 3 | 4;
}

export default function OptionSelector<T extends string>({
  label,
  options,
  value,
  onChange,
  columns = 2,
}: OptionSelectorProps<T>) {
  const gridCols =
    columns === 4
      ? "grid-cols-2 sm:grid-cols-4"
      : columns === 3
        ? "grid-cols-2 sm:grid-cols-3"
        : "grid-cols-2";

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
      <div className={`grid ${gridCols} gap-2`}>
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-xl border px-3 py-3 text-left text-sm font-medium transition-all ${
                isSelected
                  ? "border-violet-500 bg-violet-50 text-violet-800 shadow-sm ring-1 ring-violet-500/30"
                  : "border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-violet-50/50"
              }`}
              aria-pressed={isSelected}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
