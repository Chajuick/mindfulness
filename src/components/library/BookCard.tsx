"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { BookMeta } from "@/lib/types";

/**
 * 표지는 두 테마에서 같은 색을 쓴다.
 * 천을 씌운 양장본은 낮이든 밤이든 색이 변하지 않고,
 * 옅게 물들인 판형은 책보다 UI 카드처럼 읽힌다.
 */
function boards(hue: number) {
  return {
    face: `linear-gradient(158deg, hsl(${hue} 17% 30%) 0%, hsl(${hue} 16% 24%) 58%, hsl(${hue} 17% 21%) 100%)`,
    spine: `hsl(${hue} 21% 15%)`,
    foil: `hsl(${hue} 12% 87%)`,
    rule: `hsl(${hue} 12% 87% / 0.26)`,
  };
}

export function BookCard({ book, index }: { book: BookMeta; index: number }) {
  const count = book.entries.length;
  const span =
    count > 1
      ? `${book.entries[0].label} – ${book.entries[count - 1].label}`
      : book.entries[0].label;
  const c = boards(book.hue);

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
          whileHover={{ y: -7 }}
          whileTap={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="book-shadow relative flex aspect-[3/4.3] overflow-hidden rounded-[2px] rounded-l-[3px]"
        >
          {/* 책등. 위아래의 띠는 실을 묶은 자리다. */}
          <div
            className="relative w-[13px] shrink-0 sm:w-[15px]"
            style={{ background: c.spine }}
          >
            <span className="absolute inset-y-0 right-0 w-px bg-white/14" />
            <span className="absolute inset-y-0 right-[3px] w-px bg-black/25" />
            <span className="absolute inset-x-0 top-[15%] h-px bg-white/10" />
            <span className="absolute inset-x-0 top-[calc(15%+1px)] h-px bg-black/35" />
            <span className="absolute inset-x-0 bottom-[15%] h-px bg-black/35" />
            <span className="absolute inset-x-0 bottom-[calc(15%-1px)] h-px bg-white/10" />
          </div>

          {/* 표지 */}
          <div
            className="grain relative flex min-w-0 flex-1 flex-col px-4 pb-4 pt-[38%] sm:px-5 sm:pb-5"
            style={{ background: c.face }}
          >
            <h3
              className="font-display text-[1.6rem] leading-[1.15] tracking-[0.04em] sm:text-[1.85rem]"
              style={{ fontWeight: 700, color: c.foil }}
            >
              {book.word}
            </h3>
            {book.subtitle && (
              <p
                className="mt-2.5 line-clamp-3 text-[0.6875rem] leading-[1.7]"
                style={{ color: c.foil, opacity: 0.62 }}
              >
                {book.subtitle}
              </p>
            )}

            <div className="mt-auto pt-5">
              <span className="block h-px w-full" style={{ background: c.rule }} />
              <div
                className="mt-2.5 flex items-center gap-2 text-[0.625rem] tracking-[0.1em]"
                style={{ color: c.foil, opacity: 0.55 }}
              >
                <span>{count}장</span>
                <span className="h-2.5 w-px bg-current opacity-50" />
                <span className="truncate">{span}</span>
              </div>
            </div>
          </div>

          {/* 책배 */}
          <div className="fore-edge w-[4px] shrink-0" />
        </motion.article>
      </Link>
    </motion.div>
  );
}
