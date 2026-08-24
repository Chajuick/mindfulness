"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Entry } from "@/lib/types";
import type { PageMetrics } from "@/lib/paginate";
import { Page, type PageVariant } from "./Page";
import { BlockView } from "./BlockView";
import { EntryHead } from "./EntryHead";

export type Measured = { metrics: PageMetrics; heights: number[][] };

/**
 * 화면 밖에서 실제와 동일한 조판으로 높이를 잰다.
 * 1) 장 껍데기를 렌더해 본문 영역 크기를 얻고
 * 2) 그 폭으로 모든 블록의 높이를 잰다.
 * 웹폰트가 늦게 오면 높이가 달라지므로 fonts.ready 이후 다시 잰다.
 */
export function Measurer({
  entries,
  pageW,
  pageH,
  variant,
  gap,
  headGap,
  onMeasured,
}: {
  entries: Entry[];
  pageW: number;
  pageH: number;
  variant: PageVariant;
  gap: number;
  headGap: number;
  onMeasured: (result: Measured) => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    const fonts = document.fonts;
    if (!fonts) {
      setFontsReady(true);
      return;
    }
    let cancelled = false;
    fonts.ready.then(() => {
      if (!cancelled) setFontsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el || pageW <= 0 || pageH <= 0) return;
    const rect = el.getBoundingClientRect();
    setBox({ w: rect.width, h: rect.height });
  }, [pageW, pageH, variant, fontsReady]);

  const measure = useCallback(() => {
    if (!box || !probeRef.current || !headRef.current) return;
    const headH = headRef.current.getBoundingClientRect().height + headGap;
    const heights = Array.from(probeRef.current.children).map((group) =>
      Array.from(group.children).map(
        (child) => (child as HTMLElement).getBoundingClientRect().height
      )
    );
    onMeasured({ metrics: { contentW: box.w, contentH: box.h, gap, headH }, heights });
  }, [box, gap, headGap, onMeasured]);

  useLayoutEffect(() => {
    measure();
  }, [measure, fontsReady, entries]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 -z-50 overflow-hidden"
      style={{ visibility: "hidden", width: 0, height: 0 }}
    >
      <div style={{ width: pageW, height: pageH }}>
        <Page variant={variant} contentRef={contentRef} />
      </div>

      <div style={{ width: box?.w ?? pageW }}>
        <div ref={headRef}>{entries[0] && <EntryHead entry={entries[0]} />}</div>
        <div ref={probeRef}>
          {entries.map((entry) => (
            <div key={entry.date} className="prose-diary flex flex-col">
              {entry.blocks.map((block, j) => (
                <BlockView key={j} block={block} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
