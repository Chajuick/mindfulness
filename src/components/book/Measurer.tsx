"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Entry } from "@/lib/types";
import type { PageMetrics } from "@/lib/paginate";
import { snapToGrid, type Metrics } from "@/lib/layout";
import { Page, type PageVariant } from "./Page";
import { BlockRow } from "./BlockView";

export type Measured = { metrics: PageMetrics; heights: number[][] };

/**
 * 화면 밖에서 실제와 동일한 조판으로 높이를 잰다.
 * 1) 장 껍데기를 렌더해 판면 크기를 얻고
 * 2) 그 폭으로 모든 블록의 높이를 잰다.
 *
 * 글 머리는 재지 않는다. 높이가 행간의 배수로 고정되어 있기 때문이다.
 * 웹폰트가 늦게 오면 높이가 달라지므로 fonts.ready 이후 다시 잰다.
 */
export function Measurer({
  entries,
  pageW,
  pageH,
  variant,
  type,
  onMeasured,
}: {
  entries: Entry[];
  pageW: number;
  pageH: number;
  variant: PageVariant;
  type: Metrics;
  onMeasured: (result: Measured) => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
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
    if (!box || !probeRef.current) return;
    const heights = Array.from(probeRef.current.children).map((group) =>
      Array.from(group.children).map(
        (child) => (child as HTMLElement).getBoundingClientRect().height
      )
    );
    onMeasured({
      metrics: {
        contentW: box.w,
        contentH: snapToGrid(box.h, type.leading),
        gap: type.leading,
        headH: type.headHeight,
      },
      heights,
    });
  }, [box, type.leading, type.headHeight, onMeasured]);

  useLayoutEffect(() => {
    measure();
  }, [measure, fontsReady, entries]);

  const probeType = {
    "--fs": `${type.fontSize}px`,
    "--lh": `${type.leading}px`,
  } as CSSProperties;

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
        <div ref={probeRef}>
          {entries.map((entry) => (
            <div
              key={entry.date}
              className="prose-diary flex flex-col"
              style={probeType}
            >
              {entry.blocks.map((block, j) => (
                <BlockRow key={j} block={block} first leading={0} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
