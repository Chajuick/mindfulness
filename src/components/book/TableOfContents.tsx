"use client";

import { AnimatePresence, motion } from "framer-motion";
import { weekdayOf } from "@/lib/parse";
import type { Book } from "@/lib/types";

export function TableOfContents({
  book,
  open,
  opened,
  currentEntry,
  onPick,
  onClose,
}: {
  book: Book;
  open: boolean;
  opened: number | null;
  currentEntry: number;
  onPick: (entryIndex: number) => void;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />
          <motion.aside
            className="grain fixed inset-x-0 bottom-0 z-50 max-h-[76dvh] overflow-hidden rounded-t-xl border-t border-rule bg-paper sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[24rem] sm:rounded-none sm:border-l sm:border-t-0"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.34, ease: [0.22, 0.61, 0.24, 1] }}
            role="dialog"
            aria-label="목차"
          >
            <div className="flex items-center justify-between border-b border-rule/70 px-5 py-4">
              <div>
                <p className="text-[0.625rem] tracking-[0.24em] text-ink-3">목차</p>
                <p className="mt-1 font-display text-[1.0625rem] text-ink">
                  {book.word}
                  <span className="ml-2 text-[0.75rem] text-ink-3">
                    {book.entries.length}장
                    {opened !== null && opened > 0 && ` · ${opened}번 펼침`}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid size-8 place-items-center rounded-full text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink"
                aria-label="닫기"
              >
                <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <ul className="thin-scroll max-h-[calc(76dvh-5.5rem)] overflow-y-auto px-2 py-2 sm:max-h-[calc(100dvh-5.5rem)]">
              {book.entries.map((entry, i) => {
                const active = i === currentEntry;
                return (
                  <li key={entry.date}>
                    <button
                      type="button"
                      onClick={() => onPick(i)}
                      className={`flex w-full items-start gap-3.5 rounded-md px-3 py-3 text-left transition-colors ${
                        active ? "bg-paper-2" : "hover:bg-paper-2/60"
                      }`}
                    >
                      <span
                        className={`mt-px w-11 shrink-0 font-display text-[0.9375rem] ${
                          active ? "text-accent" : "text-ink"
                        }`}
                      >
                        {entry.label}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 text-[0.625rem] text-ink-3">
                          {weekdayOf(entry.date)}요일
                          <span className="h-2 w-px bg-rule" />
                          {entry.chars.toLocaleString()}자
                        </span>
                        <span className="mt-1 block line-clamp-2 text-[0.75rem] leading-relaxed text-ink-2">
                          {entry.excerpt}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
