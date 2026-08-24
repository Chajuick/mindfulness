import { weekdayOf } from "@/lib/parse";
import type { Entry } from "@/lib/types";

/**
 * 글의 첫 장 머리. 장(章)이 열리는 자리.
 *
 * 높이가 행간의 배수로 고정되어 있어, 본문 첫 줄이 언제나 그리드에 얹힌다.
 * 위쪽 여백(sinkage)은 이 고정 높이 안에서 자연히 생긴다.
 */
export function EntryHead({
  entry,
  height,
  leading,
}: {
  entry: Entry;
  height: number;
  leading: number;
}) {
  return (
    <header
      className="flex flex-col justify-end"
      style={{ height, paddingBottom: leading }}
    >
      <div
        className="font-display text-[1.5rem] leading-none tracking-[0.04em] text-ink"
        style={{ fontWeight: 700 }}
      >
        {entry.label}
      </div>
      <div className="mt-[0.55rem] text-[0.5625rem] tracking-[0.26em] text-ink-3">
        {entry.year}년 {entry.month}월 {entry.day}일 {weekdayOf(entry.date)}요일
      </div>
    </header>
  );
}
