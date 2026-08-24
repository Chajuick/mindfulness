import { weekdayOf } from "@/lib/parse";
import type { Entry } from "@/lib/types";

/** 글의 첫 장 머리. 날짜와 단어. */
export function EntryHead({ entry }: { entry: Entry }) {
  return (
    <header>
      <div className="flex items-baseline gap-2.5">
        <span
          className="font-display text-[1.875rem] leading-none tracking-tight text-ink"
          style={{ fontWeight: 700 }}
        >
          {entry.label}
        </span>
        <span className="text-[0.6875rem] text-ink-3">{weekdayOf(entry.date)}요일</span>
      </div>
      <div className="mt-2.5 flex items-center gap-2.5">
        <span className="text-[0.625rem] tracking-[0.24em] text-accent">
          {entry.word}
        </span>
        <span className="h-px flex-1 bg-rule/70" />
      </div>
    </header>
  );
}
