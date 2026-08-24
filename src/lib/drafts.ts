"use client";

export type Draft = {
  id: string;
  /** 핵심단어 = 이 초고가 들어갈 권 */
  word: string;
  /** ISO 날짜 */
  date: string;
  body: string;
  updatedAt: number;
};

const KEY = "mg:drafts";

function read(): Draft[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isDraft);
  } catch {
    return [];
  }
}

function isDraft(value: unknown): value is Draft {
  if (typeof value !== "object" || value === null) return false;
  const d = value as Record<string, unknown>;
  return (
    typeof d.id === "string" &&
    typeof d.word === "string" &&
    typeof d.date === "string" &&
    typeof d.body === "string"
  );
}

function write(drafts: Draft[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(drafts));
  } catch {
    // 저장 공간이 없으면 이번 세션 동안만 유지된다
  }
}

export function listDrafts(): Draft[] {
  return read().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function putDraft(draft: Draft): void {
  const rest = read().filter((d) => d.id !== draft.id);
  write([draft, ...rest]);
}

export function removeDraft(id: string): void {
  write(read().filter((d) => d.id !== id));
}

export function newDraft(word = ""): Draft {
  const now = new Date();
  const iso = [
    now.getFullYear(),
    `${now.getMonth() + 1}`.padStart(2, "0"),
    `${now.getDate()}`.padStart(2, "0"),
  ].join("-");
  return {
    id: `${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    word,
    date: iso,
    body: "",
    updatedAt: now.getTime(),
  };
}
