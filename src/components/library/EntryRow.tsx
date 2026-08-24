"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { weekdayOf } from "@/lib/parse";
import type { EntryMeta } from "@/lib/types";

export function EntryRow({ entry, index }: { entry: EntryMeta; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.035, 0.35) }}
    >
      <Link
        href={`/book/${entry.bookSlug}?d=${encodeURIComponent(entry.label)}`}
        className="group -mx-3 flex items-start gap-4 rounded-lg px-3 py-4 transition-colors hover:bg-paper/70 sm:gap-6"
      >
        <div className="w-[3.25rem] shrink-0 pt-0.5 text-right sm:w-16">
          <div className="font-display text-[1.0625rem] leading-none tracking-tight text-ink">
            {entry.label}
          </div>
          <div className="mt-1.5 text-[0.6875rem] text-ink-3">
            {weekdayOf(entry.date)}
          </div>
        </div>

        <span className="mt-2 h-px w-4 shrink-0 bg-rule sm:w-6" aria-hidden="true" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-[0.9375rem] text-ink transition-colors group-hover:text-accent">
              {entry.word}
            </span>
            <span className="text-[0.625rem] tracking-wide text-ink-3">
              {entry.chars.toLocaleString()}자
            </span>
          </div>
          <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-2">
            {entry.excerpt}
          </p>
        </div>
      </Link>
    </motion.li>
  );
}
