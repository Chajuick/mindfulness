"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { countChars, parseBlocks, weekdayOf } from "@/lib/parse";
import { listDrafts, newDraft, putDraft, removeDraft, type Draft } from "@/lib/drafts";
import { downloadMarkdown, targetPathOf, toMarkdown } from "@/lib/serialize";
import { BlockView } from "@/components/book/BlockView";
import { longDate } from "@/lib/view";

type SaveState = "idle" | "saving" | "saved";

export function Composer({ words }: { words: string[] }) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [save, setSave] = useState<SaveState>("idle");
  const [preview, setPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const existing = listDrafts();
    setDrafts(existing);
    setDraft(existing[0] ?? newDraft(words[0] ?? ""));
    // words는 서버에서 온 고정 목록이라 최초 1회만 쓴다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 타이핑이 멎으면 저장한다
  useEffect(() => {
    if (!draft) return;
    if (timer.current) clearTimeout(timer.current);
    setSave("saving");
    timer.current = setTimeout(() => {
      const stamped = { ...draft, updatedAt: Date.now() };
      putDraft(stamped);
      setDrafts(listDrafts());
      setSave("saved");
    }, 550);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [draft]);

  const patch = useCallback((next: Partial<Draft>) => {
    setDraft((current) => (current ? { ...current, ...next } : current));
  }, []);

  const blocks = useMemo(() => (draft ? parseBlocks(draft.body) : []), [draft]);
  const chars = useMemo(() => countChars(blocks), [blocks]);

  function start() {
    const fresh = newDraft(draft?.word ?? words[0] ?? "");
    putDraft(fresh);
    setDrafts(listDrafts());
    setDraft(fresh);
    setPreview(false);
  }

  function open(id: string) {
    const found = drafts.find((d) => d.id === id);
    if (found) {
      setDraft(found);
      setPreview(false);
    }
  }

  function discard() {
    if (!draft) return;
    removeDraft(draft.id);
    const rest = listDrafts();
    setDrafts(rest);
    setDraft(rest[0] ?? newDraft(words[0] ?? ""));
  }

  async function copy() {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(toMarkdown(draft));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // 클립보드를 못 쓰면 내보내기를 쓰면 된다
    }
  }

  if (!draft) {
    return <div className="h-64" aria-busy="true" />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[13rem_1fr]">
      {/* 초고 목록 */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="flex items-center justify-between">
          <h2 className="text-[0.625rem] tracking-[0.24em] text-ink-3">초고</h2>
          <button
            type="button"
            onClick={start}
            className="text-[0.75rem] text-accent transition-opacity hover:opacity-70"
          >
            새로
          </button>
        </div>

        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {drafts.map((d) => {
            const active = d.id === draft.id;
            return (
              <li key={d.id} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  onClick={() => open(d.id)}
                  className={`w-full rounded-md border px-3 py-2.5 text-left transition-colors ${
                    active
                      ? "border-accent/50 bg-paper"
                      : "border-rule/60 bg-paper/40 hover:bg-paper"
                  }`}
                >
                  <span className="flex items-baseline gap-2">
                    <span className="font-display text-[0.875rem] text-ink">
                      {d.date.slice(5).replace("-", ".")}
                    </span>
                    <span className="truncate text-[0.6875rem] text-ink-3">
                      {d.word || "단어 없음"}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-[0.6875rem] text-ink-3">
                    {d.body.trim().split("\n")[0] || "빈 초고"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 hidden text-[0.6875rem] leading-relaxed text-ink-3 lg:block">
          초고는 이 브라우저에만 저장됩니다. 아무도 볼 수 없습니다.
        </p>
      </aside>

      {/* 편집 */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
          <label className="block">
            <span className="block text-[0.625rem] tracking-[0.24em] text-ink-3">
              핵심단어
            </span>
            <input
              list="mg-words"
              value={draft.word}
              onChange={(e) => patch({ word: e.target.value })}
              placeholder="감기"
              className="mt-1.5 w-40 border-b border-rule bg-transparent pb-1 font-display text-[1.375rem] text-ink outline-none transition-colors placeholder:text-ink-3/50 focus:border-accent"
            />
            <datalist id="mg-words">
              {words.map((w) => (
                <option key={w} value={w} />
              ))}
            </datalist>
          </label>

          <label className="block">
            <span className="block text-[0.625rem] tracking-[0.24em] text-ink-3">
              날짜
            </span>
            <input
              type="date"
              value={draft.date}
              onChange={(e) => patch({ date: e.target.value })}
              className="mt-1.5 border-b border-rule bg-transparent pb-1 font-body text-[0.9375rem] text-ink outline-none transition-colors focus:border-accent"
            />
          </label>

          <span className="pb-1.5 text-[0.6875rem] text-ink-3">
            {longDate(draft.date)} {weekdayOf(draft.date)}요일
          </span>

          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="ml-auto pb-1.5 text-[0.75rem] text-ink-2 transition-colors hover:text-ink"
          >
            {preview ? "고쳐 쓰기" : "책처럼 보기"}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={preview ? "preview" : "edit"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24 }}
            className="mt-6"
          >
            {preview ? (
              <div className="grain relative min-h-[26rem] rounded-[3px] bg-paper px-7 py-8 shadow-[0_1px_3px_rgb(var(--shadow-warm)/0.1),0_18px_34px_-20px_rgb(var(--shadow-warm)/0.3)] sm:px-10 sm:py-12">
                <div className="mx-auto max-w-prose">
                  <div className="flex items-baseline gap-2.5">
                    <span
                      className="font-display text-[1.875rem] leading-none text-ink"
                      style={{ fontWeight: 700 }}
                    >
                      {draft.date.slice(5).replace("-", ".")}
                    </span>
                    <span className="text-[0.6875rem] text-ink-3">
                      {weekdayOf(draft.date)}요일
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2.5">
                    <span className="text-[0.625rem] tracking-[0.24em] text-accent">
                      {draft.word || "단어 없음"}
                    </span>
                    <span className="h-px flex-1 bg-rule/70" />
                  </div>
                  <div className="prose-diary mt-7 flex flex-col gap-5">
                    {blocks.length === 0 ? (
                      <p className="text-ink-3">아직 아무것도 적지 않았습니다.</p>
                    ) : (
                      blocks.map((block, i) => <BlockView key={i} block={block} />)
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grain relative rounded-[3px] bg-paper shadow-[0_1px_3px_rgb(var(--shadow-warm)/0.1),0_18px_34px_-20px_rgb(var(--shadow-warm)/0.3)]">
                <textarea
                  value={draft.body}
                  onChange={(e) => patch({ body: e.target.value })}
                  placeholder={
                    "오늘 있었던 일과, 그것을 지나며 든 생각을\n담담하게 적어봅니다.\n\n빈 줄로 문단을 나눕니다.\n따옴표로 감싼 줄은 인용처럼 조판됩니다."
                  }
                  spellCheck={false}
                  className="manuscript prose-diary thin-scroll relative block min-h-[26rem] w-full resize-y bg-transparent px-7 py-8 text-ink outline-none placeholder:text-ink-3/60 sm:px-10 sm:py-12"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 내보내기 */}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
          <span className="text-[0.6875rem] tabular-nums text-ink-3">
            {chars.toLocaleString()}자
          </span>
          <span className="text-[0.6875rem] text-ink-3">
            {save === "saved" ? "저장됨" : save === "saving" ? "…" : ""}
          </span>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={discard}
              className="rounded-full px-3 py-1.5 text-[0.75rem] text-ink-3 transition-colors hover:text-accent"
            >
              버리기
            </button>
            <button
              type="button"
              onClick={copy}
              className="rounded-full border border-rule px-3.5 py-1.5 text-[0.75rem] text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
            >
              {copied ? "복사했습니다" : "전문 복사"}
            </button>
            <button
              type="button"
              onClick={() => downloadMarkdown(draft)}
              disabled={!draft.body.trim()}
              className="rounded-full bg-ink px-4 py-1.5 text-[0.75rem] text-paper transition-opacity hover:opacity-85 disabled:pointer-events-none disabled:opacity-30"
            >
              .md 내보내기
            </button>
          </div>
        </div>

        <p className="mt-4 rounded-md border border-dashed border-rule px-4 py-3 text-[0.6875rem] leading-relaxed text-ink-2">
          내보낸 파일을{" "}
          <code className="rounded bg-paper px-1.5 py-0.5 text-[0.6875rem] text-ink">
            {targetPathOf(draft)}
          </code>{" "}
          에 두고 커밋하면 한 장이 됩니다. 그때부터 누구나 읽을 수 있습니다.
        </p>
      </div>
    </div>
  );
}
