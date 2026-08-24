"use client";

import { useMemo, useState } from "react";
import { MONTH_NAMES, monthCounts, yearsOf } from "@/lib/view";
import type { EntryMeta } from "@/lib/types";
import { EntryRow } from "./EntryRow";

const ALL = "all" as const;

export function Chronicle({ entries }: { entries: EntryMeta[] }) {
  const years = useMemo(() => yearsOf(entries), [entries]);
  const [year, setYear] = useState<number | typeof ALL>(years[0] ?? ALL);
  const [month, setMonth] = useState<number | null>(null);

  const counts = useMemo(
    () => (year === ALL ? Array<number>(12).fill(0) : monthCounts(entries, year)),
    [entries, year]
  );

  const visible = useMemo(
    () =>
      entries.filter(
        (e) =>
          (year === ALL || e.year === year) && (month === null || e.month === month)
      ),
    [entries, year, month]
  );

  /** 월 헤더를 끼워 넣기 위해 연·월로 묶는다. */
  const groups = useMemo(() => {
    const out: { key: string; label: string; items: EntryMeta[] }[] = [];
    for (const e of visible) {
      const key = `${e.year}-${e.month}`;
      const last = out.at(-1);
      if (last?.key === key) last.items.push(e);
      else
        out.push({ key, label: `${e.year}년 ${MONTH_NAMES[e.month - 1]}`, items: [e] });
    }
    return out;
  }, [visible]);

  function pickYear(next: number | typeof ALL) {
    setYear(next);
    setMonth(null);
  }

  return (
    <div>
      {/* 연도 */}
      <div className="flex flex-wrap items-center gap-1.5">
        {years.map((y) => (
          <button
            key={y}
            type="button"
            onClick={() => pickYear(y)}
            aria-pressed={year === y}
            className={`rounded-full px-3.5 py-1.5 font-display text-[0.875rem] tracking-wide transition-colors ${
              year === y ? "seg-on" : "text-ink-3 hover:bg-paper hover:text-ink"
            }`}
          >
            {y}
          </button>
        ))}
        {years.length > 1 && (
          <button
            type="button"
            onClick={() => pickYear(ALL)}
            aria-pressed={year === ALL}
            className={`rounded-full px-3.5 py-1.5 text-[0.8125rem] tracking-wide transition-colors ${
              year === ALL ? "seg-on" : "text-ink-3 hover:bg-paper hover:text-ink"
            }`}
          >
            전체
          </button>
        )}
      </div>

      {/* 월 스트립 */}
      {year !== ALL && (
        <div className="mt-5 grid grid-cols-6 gap-1.5 sm:grid-cols-12">
          {MONTH_NAMES.map((name, i) => {
            const n = counts[i];
            const active = month === i + 1;
            return (
              <button
                key={name}
                type="button"
                disabled={n === 0}
                onClick={() => setMonth(active ? null : i + 1)}
                aria-pressed={active}
                className={`flex h-[3.75rem] flex-col items-center justify-center gap-1.5 rounded-md border transition-all ${
                  active
                    ? "border-accent/60 bg-paper shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--accent)_30%,transparent)]"
                    : n === 0
                      ? "cursor-default border-transparent text-ink-3/45"
                      : "border-rule/60 bg-paper/50 text-ink-2 hover:border-rule hover:bg-paper"
                }`}
                title={n === 0 ? `${name} — 글 없음` : `${name} — ${n}장`}
              >
                <span
                  className={`text-[0.75rem] tracking-wide ${active ? "text-accent" : ""}`}
                >
                  {name}
                </span>
                <span className="flex h-1.5 items-center gap-[3px]" aria-hidden="true">
                  {Array.from({ length: Math.min(n, 4) }).map((_, d) => (
                    <span
                      key={d}
                      className="size-[3px] rounded-full"
                      style={{
                        background: active ? "var(--accent)" : "var(--ink-3)",
                      }}
                    />
                  ))}
                  {n > 4 && (
                    <span className="ml-px text-[0.5625rem] leading-none text-ink-3">
                      +{n - 4}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 목록 */}
      <div className="mt-9">
        {groups.length === 0 ? (
          <p className="py-16 text-center text-[0.875rem] text-ink-3">
            이 달에는 적어둔 것이 없습니다.
          </p>
        ) : (
          groups.map((group) => (
            <section key={group.key} className="mb-8">
              <h3 className="mb-1 flex items-center gap-3 text-[0.6875rem] tracking-[0.2em] text-ink-3">
                {group.label}
                <span className="h-px flex-1 bg-rule/70" />
                <span className="tabular-nums">{group.items.length}장</span>
              </h3>
              <ul className="divide-y divide-rule/40">
                {group.items.map((entry, i) => (
                  <EntryRow
                    key={`${entry.bookSlug}-${entry.date}`}
                    entry={entry}
                    index={i}
                  />
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
