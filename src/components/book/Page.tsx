import type { ReactNode, RefObject } from "react";

export type PageVariant = "left" | "right" | "single";

/** 책등 쪽 여백을 더 넉넉히 둬서 펼침면이 안으로 말려 들어가는 느낌을 만든다. */
export function pagePadding(variant: PageVariant) {
  if (variant === "single") {
    return { paddingLeft: 26, paddingRight: 26, paddingTop: 30, paddingBottom: 22 };
  }
  const gutter = 52;
  const outer = 40;
  return {
    paddingLeft: variant === "left" ? outer : gutter,
    paddingRight: variant === "left" ? gutter : outer,
    paddingTop: 38,
    paddingBottom: 26,
  };
}

/**
 * 한 장의 껍데기. 본문 영역을 flex로 남겨두므로
 * contentRef의 실측 높이가 그대로 "한 장에 담을 수 있는 높이"가 된다.
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
  const outerAlign = variant === "left" ? "justify-start" : "justify-end";

  return (
    <div className="grain relative h-full w-full overflow-hidden bg-paper">
      {variant !== "single" && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 w-[11%] ${
            variant === "left" ? "gutter-r right-0" : "gutter-l left-0"
          }`}
        />
      )}
      <span
        aria-hidden="true"
        className="page-vignette pointer-events-none absolute inset-0"
      />

      <div className="relative flex h-full flex-col" style={pagePadding(variant)}>
        <div
          className={`flex h-3.5 shrink-0 items-center ${outerAlign} text-[0.5625rem] tracking-[0.22em] text-ink-3`}
        >
          {runningHead}
        </div>

        <div ref={contentRef} className="relative min-h-0 flex-1 overflow-hidden">
          {children}
        </div>

        <div
          className={`flex h-5 shrink-0 items-end ${outerAlign} text-[0.625rem] tabular-nums tracking-widest text-ink-3`}
        >
          {folio}
        </div>
      </div>
    </div>
  );
}
