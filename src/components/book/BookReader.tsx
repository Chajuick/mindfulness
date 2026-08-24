"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useViewport } from "@/hooks/useViewport";
import { metricsFor, singleSize, spreadSize } from "@/lib/layout";
import { firstLeafOfEntry, padToSpreads, paginate } from "@/lib/paginate";
import type { Book } from "@/lib/types";
import { Measurer, type Measured } from "./Measurer";
import { Spread, type FlipDir } from "./Spread";
import { Slider } from "./Slider";
import { TableOfContents } from "./TableOfContents";

export function BookReader({ book }: { book: Book }) {
  // ?d=08.24 로 특정 글을 바로 펼친다. 정적 배포에서도 동작하도록 클라이언트에서 읽는다.
  const [initialLabel] = useState<string | undefined>(() => {
    if (typeof window === "undefined") return undefined;
    return new URLSearchParams(window.location.search).get("d") ?? undefined;
  });

  const isWide = useMediaQuery("(min-width: 900px)");
  const { vw, vh } = useViewport();

  const size = useMemo(
    () => (isWide ? spreadSize(vw, vh) : singleSize(vw, vh)),
    [isWide, vw, vh]
  );
  const pageW = isWide ? Math.floor(size.width / 2) : size.width;
  const type = useMemo(() => metricsFor(isWide), [isWide]);

  const [measured, setMeasured] = useState<Measured | null>(null);
  const onMeasured = useCallback((result: Measured) => setMeasured(result), []);

  const leaves = useMemo(() => {
    if (!measured || vw === 0) return [];
    const packed = paginate(book.entries, measured.heights, measured.metrics);
    return isWide ? padToSpreads(packed) : packed;
  }, [measured, book.entries, isWide, vw]);

  const [pos, setPos] = useState(0);
  const [flip, setFlip] = useState<FlipDir | null>(null);
  const [dir, setDir] = useState<FlipDir>(1);
  const [tocOpen, setTocOpen] = useState(false);

  // 다시 조판되어도 읽던 글을 놓치지 않도록 현재 글을 기억한다
  const anchor = useRef(0);
  const seeded = useRef(false);

  useEffect(() => {
    if (leaves.length === 0) return;
    if (!seeded.current) {
      seeded.current = true;
      if (initialLabel) {
        const found = book.entries.findIndex((e) => e.label === initialLabel);
        if (found >= 0) anchor.current = found;
      }
    }
    const target = firstLeafOfEntry(leaves, anchor.current);
    setPos(isWide ? target - (target % 2) : target);
    setFlip(null);
  }, [leaves, isWide, initialLabel, book.entries]);

  useEffect(() => {
    const leaf = leaves[pos];
    if (leaf && leaf.pageInEntry >= 0) anchor.current = leaf.entryIndex;
  }, [pos, leaves]);

  const step = isWide ? 2 : 1;
  const canPrev = pos - step >= 0;
  const canNext = pos + step < leaves.length;

  const go = useCallback(
    (d: FlipDir) => {
      if (d === 1 ? !canNext : !canPrev) return;
      if (isWide) {
        if (flip !== null) return;
        setFlip(d);
        return;
      }
      setDir(d);
      setPos((p) => p + d);
    },
    [canNext, canPrev, isWide, flip]
  );

  function onFlipEnd() {
    if (flip === null) return;
    setPos((p) => p + flip * 2);
    setFlip(null);
  }

  const seek = useCallback(
    (entryIndex: number) => {
      anchor.current = entryIndex;
      const target = firstLeafOfEntry(leaves, entryIndex);
      setFlip(null);
      setDir(target >= pos ? 1 : -1);
      setPos(isWide ? target - (target % 2) : target);
      setTocOpen(false);
    },
    [leaves, isWide, pos]
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "Escape") {
        setTocOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const current = leaves[pos];
  const currentEntry =
    current && current.pageInEntry >= 0 ? current.entryIndex : anchor.current;
  const entryStarts = useMemo(
    () => leaves.map((l, i) => (l.pageInEntry === 0 ? i : -1)).filter((i) => i >= 0),
    [leaves]
  );

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col">
      {/* 표제 */}
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 pb-1 pt-6 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[0.75rem] text-ink-3 transition-colors hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden="true">
            <path
              d="M14 6l-6 6 6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          서재
        </Link>

        <div className="min-w-0 flex-1 text-center">
          <h1
            className="font-display text-[1.0625rem] tracking-[0.1em] text-ink"
            style={{ fontWeight: 700 }}
          >
            {book.word}
          </h1>
          {book.subtitle && (
            <p className="mt-0.5 truncate text-[0.6875rem] text-ink-3">
              {book.subtitle}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setTocOpen(true)}
          className="text-[0.75rem] text-ink-3 transition-colors hover:text-ink"
        >
          목차
        </button>
      </div>

      {/* 책 */}
      <div className="flex flex-1 items-center justify-center px-4 py-6 sm:py-8">
        {leaves.length === 0 ? (
          <div
            className="grid place-items-center rounded-[3px] border border-rule/60 bg-paper/60"
            style={{ width: size.width || 320, height: size.height || 440 }}
          >
            <span className="text-[0.75rem] tracking-[0.2em] text-ink-3">
              펼치는 중
            </span>
          </div>
        ) : isWide ? (
          <Spread
            leaves={leaves}
            book={book}
            index={pos}
            flip={flip}
            onFlipEnd={onFlipEnd}
            width={size.width}
            height={size.height}
            type={type}
          />
        ) : (
          <Slider
            leaves={leaves}
            book={book}
            index={pos}
            dir={dir}
            onNav={go}
            width={size.width}
            height={size.height}
            type={type}
          />
        )}
      </div>

      {/* 넘김 */}
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-5 px-5 pb-9 sm:px-8">
        <TurnButton dir={-1} disabled={!canPrev} onClick={() => go(-1)} />

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-baseline gap-2 text-[0.75rem] text-ink-2">
            <span className="font-display text-ink">
              {book.entries[currentEntry]?.label}
            </span>
            {/* 펼침면에서는 러닝헤드가 이미 알려주므로 한 장씩 볼 때만 표시한다 */}
            {!isWide &&
              current &&
              current.entryPageCount > 1 &&
              current.pageInEntry >= 0 && (
                <span className="text-ink-3">
                  {current.pageInEntry + 1}/{current.entryPageCount}
                </span>
              )}
          </div>
          <div className="relative h-px w-36 bg-rule sm:w-52" aria-hidden="true">
            <span
              className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-500"
              style={{ width: `${((pos + step) / Math.max(leaves.length, 1)) * 100}%` }}
            />
            {entryStarts.map((i) => (
              <span
                key={i}
                className="absolute -top-[3px] h-[7px] w-px bg-rule"
                style={{ left: `${(i / Math.max(leaves.length, 1)) * 100}%` }}
              />
            ))}
          </div>
          <span className="text-[0.625rem] tabular-nums tracking-widest text-ink-3">
            {Math.min(pos + step, leaves.length)} / {leaves.length}
          </span>
        </div>

        <TurnButton dir={1} disabled={!canNext} onClick={() => go(1)} />
      </div>

      <TableOfContents
        book={book}
        open={tocOpen}
        currentEntry={currentEntry}
        onPick={seek}
        onClose={() => setTocOpen(false)}
      />

      {vw > 0 && (
        <Measurer
          entries={book.entries}
          pageW={pageW}
          pageH={size.height}
          variant={isWide ? "right" : "single"}
          type={type}
          onMeasured={onMeasured}
        />
      )}
    </div>
  );
}

function TurnButton({
  dir,
  disabled,
  onClick,
}: {
  dir: FlipDir;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 1 ? "다음 장" : "이전 장"}
      className="grid size-10 place-items-center rounded-full border border-rule text-ink-2 transition-all hover:border-ink-3 hover:text-ink disabled:pointer-events-none disabled:opacity-25"
    >
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path
          d={dir === 1 ? "M9.5 5.5l7 6.5-7 6.5" : "M14.5 5.5l-7 6.5 7 6.5"}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
