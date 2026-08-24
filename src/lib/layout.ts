import type { PageVariant } from "@/components/book/Page";

/**
 * 베이스라인 그리드.
 *
 * 본문의 모든 세로 치수는 이 값의 배수여야 한다. 행간, 문단 사이,
 * 글 머리의 높이, 판면의 높이까지. 그래야 펼침면 좌우 페이지의 줄이
 * 같은 높이에 놓인다. 책이 책처럼 보이는 이유의 절반은 여기서 온다.
 */
export const LEADING = { wide: 32, narrow: 30 } as const;
export const FONT_SIZE = { wide: 17, narrow: 16 } as const;

/** 글 첫 장의 머리가 차지하는 줄 수. 본문이 시작되기 전의 여유(sinkage). */
export const HEAD_LINES = { wide: 4, narrow: 3 } as const;

export type Metrics = {
  leading: number;
  fontSize: number;
  headHeight: number;
};

export function metricsFor(wide: boolean): Metrics {
  const key = wide ? "wide" : "narrow";
  return {
    leading: LEADING[key],
    fontSize: FONT_SIZE[key],
    headHeight: LEADING[key] * HEAD_LINES[key],
  };
}

/**
 * 판면 여백. 고전적인 책의 비율은 안쪽 < 위 < 바깥쪽 < 아래다.
 * 안쪽을 넓게 두면 펼침면이 두 장의 종이로 갈라져 보인다.
 */
export function pageMargins(variant: PageVariant) {
  if (variant === "single") {
    return { top: 46, bottom: 58, inner: 28, outer: 28 };
  }
  return { top: 56, bottom: 68, inner: 42, outer: 60 };
}

/** 판면 높이는 행간의 배수로 떨어뜨린다. 마지막 줄이 아래 여백에 정확히 닿는다. */
export function snapToGrid(height: number, leading: number): number {
  return Math.max(Math.floor(height / leading) * leading, leading);
}

/** 펼침면 크기. 화면에 맞춰 책 전체 크기를 정한다. */
export function spreadSize(vw: number, vh: number) {
  const width = Math.min(1080, vw - 96);
  const height = Math.min(Math.max(vh - 252, 400), 728);
  return { width, height };
}

/** 모바일 한 장 크기 */
export function singleSize(vw: number, vh: number) {
  const width = Math.min(vw - 32, 512);
  const height = Math.min(Math.max(vh - 232, 400), 760);
  return { width, height };
}
