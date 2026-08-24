"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { BookMeta } from "@/lib/types";

/** hue를 종이색과 섞어 두 테마에서 모두 자연스러운 표지색을 만든다. */
function cover(hue: number, strength: number) {
  return `color-mix(in oklab, hsl(${hue} 48% 52%) ${strength}%, var(--paper))`;
}

export function BookCard({ book, index }: { book: BookMeta; index: number }) {
  const count = book.entries.length;
  const span =
    count > 1
      ? `${book.entries[0].label} – ${book.entries[count - 1].label}`
      : book.entries[0].label;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.06, 0.4),
        ease: [0.22, 0.61, 0.24, 1],
      }}
    >
      <Link
        href={`/book/${book.slug}`}
        className="group block focus-visible:outline-none"
        aria-label={`${book.word} — ${count}장`}
      >
        <motion.article
          whileHover={{ y: -6, rotateZ: -0.5 }}
          whileTap={{ y: -2 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="grain relative flex aspect-[3/4.05] overflow-hidden rounded-[3px] rounded-l-[2px] shadow-[0_2px_5px_rgb(var(--shadow-warm)/0.14),0_14px_30px_-14px_rgb(var(--shadow-warm)/0.28)] transition-shadow duration-500 group-hover:shadow-[0_4px_10px_rgb(var(--shadow-warm)/0.18),0_28px_50px_-18px_rgb(var(--shadow-warm)/0.4)]"
          style={{ background: cover(book.hue, 13) }}
        >
          {/* 책등 */}
          <div
            className="relative w-[9px] shrink-0 sm:w-[11px]"
            style={{ background: cover(book.hue, 34) }}
          >
            <span className="absolute inset-y-0 right-0 w-px bg-white/25" />
            <span className="absolute inset-y-0 left-[3px] w-px bg-black/10" />
          </div>

          {/* 표지 */}
          <div className="relative flex min-w-0 flex-1 flex-col p-4 sm:p-5">
            <span
              className="pointer-events-none absolute inset-2.5 rounded-[2px] border"
              style={{
                borderColor: `color-mix(in oklab, var(--gilt) 42%, transparent)`,
              }}
            />

            {book.sample && (
              <span className="relative self-start rounded-full border border-rule px-2 py-px text-[0.625rem] tracking-[0.14em] text-ink-3">
                예시
              </span>
            )}

            <div className="relative mt-auto">
              <h3
                className="font-display text-[1.75rem] leading-tight tracking-[0.02em] text-ink sm:text-[2rem]"
                style={{ fontWeight: 700 }}
              >
                {book.word}
              </h3>
              {book.subtitle && (
                <p className="mt-2 line-clamp-2 text-[0.75rem] leading-relaxed text-ink-2/90">
                  {book.subtitle}
                </p>
              )}
              <div className="mt-3 flex items-center gap-2 text-[0.6875rem] tracking-wide text-ink-3">
                <span>{count}장</span>
                <span className="h-2.5 w-px bg-current opacity-40" />
                <span className="truncate">{span}</span>
              </div>
            </div>
          </div>

          {/* 책배 (종이 두께) */}
          <div className="fore-edge w-[3px] shrink-0 opacity-70" />
        </motion.article>
      </Link>
    </motion.div>
  );
}
