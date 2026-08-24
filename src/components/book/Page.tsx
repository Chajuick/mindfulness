import type { ReactNode, RefObject } from "react";
import { pageMargins } from "@/lib/layout";

export type PageVariant = "left" | "right" | "single";

/**
 * 한 장의 껍데기.
 *
 * 쪽번호와 기둥제목(running head)은 판면 밖 여백에 절대배치한다.
 * 본문 흐름에 끼워 넣으면 판면 높이가 그만큼 줄어 그리드가 깨진다.
 */
export function Page({
  variant,
  contentRef,
  runningHead,
  folio,
  children,
}: {
  variant: PageVariant;
  contentRef?: RefObject<HTMLDivElement | null>;
  runningHead?: ReactNode;
  folio?: ReactNode;
  children?: ReactNode;
}) {
  const m = pageMargins(variant);
  const left = variant === "left" ? m.outer : m.inner;
  const right = variant === "left" ? m.inner : m.outer;
  // 쪽번호와 기둥제목은 책의 바깥쪽 모서리에 둔다
  const outerSide = variant === "left" ? "left" : "right";

  return (
    <div className="grain relative h-full w-full overflow-hidden bg-paper">
      {variant !== "single" && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 w-[13%] ${
            variant === "left" ? "gutter-r right-0" : "gutter-l left-0"
          }`}
        />
      )}
      <span
        aria-hidden="true"
        className="page-vignette pointer-events-none absolute inset-0"
      />

      {runningHead && (
        <div
          className="absolute text-[0.5625rem] tracking-[0.26em] text-ink-3"
          style={{
            top: m.top - 26,
            [outerSide]: variant === "single" ? left : m.outer,
          }}
        >
          {runningHead}
        </div>
      )}

      {/* 판면 */}
      <div
        ref={contentRef}
        className="absolute overflow-hidden"
        style={{ top: m.top, bottom: m.bottom, left, right }}
      >
        {children}
      </div>

      {folio !== undefined && (
        <div
          className="absolute text-[0.625rem] tabular-nums tracking-[0.14em] text-ink-3"
          style={{
            bottom: m.bottom - 30,
            [outerSide]: variant === "single" ? left : m.outer,
          }}
        >
          {folio}
        </div>
      )}
    </div>
  );
}
