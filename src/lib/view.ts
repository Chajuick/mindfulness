import type { Book, BookMeta, Entry, EntryMeta } from "./types";

/** 본문 블록을 떼어 클라이언트로 넘길 가벼운 형태로 만든다. */
export function toBookMeta(book: Book): BookMeta {
  return { ...book, entries: book.entries.map(stripBlocks) };
}

/** 글에서 본문 블록만 제거한다. */
export function stripBlocks(entry: Entry): EntryMeta {
  const { blocks: _blocks, ...rest } = entry;
  return rest;
}

export const MONTH_NAMES = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
] as const;

/** "2026-08-24" -> "2026년 8월 24일" */
export function longDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

export function yearsOf(entries: EntryMeta[]): number[] {
  return [...new Set(entries.map((e) => e.year))].sort((a, b) => b - a);
}

/** 연도별 12개월 글 수. 달력 스트립용. */
export function monthCounts(entries: EntryMeta[], year: number): number[] {
  const counts = Array<number>(12).fill(0);
  for (const e of entries) if (e.year === year) counts[e.month - 1] += 1;
  return counts;
}
