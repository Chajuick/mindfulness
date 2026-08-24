"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Segmented } from "@/components/ui/Segmented";
import type { BookMeta, EntryMeta } from "@/lib/types";
import { BookCard } from "./BookCard";
import { Chronicle } from "./Chronicle";

type Mode = "word" | "date";
type Sort = "recent" | "most" | "name";

const MODES = [
  { value: "word" as const, label: "단어로" },
  { value: "date" as const, label: "날짜로" },
];

const SORTS: { value: Sort; label: string }[] = [
  { value: "recent", label: "최근 순" },
  { value: "most", label: "많이 쓴 순" },
  { value: "name", label: "가나다" },
];

const MODE_KEY = "mg:view";

export function LibraryView({
  books,
  entries,
}: {
  books: BookMeta[];
  entries: EntryMeta[];
}) {
  const [mode, setMode] = useState<Mode>("word");
  const [sort, setSort] = useState<Sort>("recent");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(MODE_KEY);
      if (saved === "word" || saved === "date") setMode(saved);
    } catch {
      // 저장된 설정을 못 읽으면 기본값을 쓴다
    }
  }, []);

  function pickMode(next: Mode) {
    setMode(next);
    try {
      localStorage.setItem(MODE_KEY, next);
    } catch {
      // 저장 실패는 무시
    }
  }

  const sorted = useMemo(() => {
    const list = [...books];
    if (sort === "most")
      return list.sort((a, b) => b.entries.length - a.entries.length);
    if (sort === "name") return list.sort((a, b) => a.word.localeCompare(b.word, "ko"));
    return list.sort((a, b) => b.lastDate.localeCompare(a.lastDate));
  }, [books, sort]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Segmented options={MODES} value={mode} onChange={pickMode} label="열람 방식" />

        {mode === "word" && (
          <div className="flex items-center gap-0.5 text-[0.75rem]">
            {SORTS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSort(s.value)}
                aria-pressed={sort === s.value}
                className={`rounded-full px-2.5 py-1 transition-colors ${
                  sort === s.value ? "text-accent" : "text-ink-3 hover:text-ink-2"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {mode === "date" && (
          <span className="text-[0.75rem] text-ink-3">
            모두 {entries.length}장 · {books.length}권
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 0.61, 0.24, 1] }}
          className="mt-8"
        >
          {mode === "word" ? (
            <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-7 lg:grid-cols-4">
              {sorted.map((book, i) => (
                <li key={book.slug}>
                  <BookCard book={book} index={i} />
                </li>
              ))}
            </ul>
          ) : (
            <Chronicle entries={entries} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
