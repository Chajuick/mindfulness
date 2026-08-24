"use client";

type Option<T extends string> = { value: T; label: string };

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly Option<T>[];
  value: T;
  onChange: (next: T) => void;
  label: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="inline-flex rounded-full border border-rule/70 bg-paper/70 p-0.5"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={`rounded-full px-4 py-1.5 text-[0.8125rem] tracking-wide transition-colors ${
              active ? "seg-on" : "text-ink-3 hover:text-ink-2"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
