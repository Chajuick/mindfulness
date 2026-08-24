import type { Entry, Leaf } from "./types";

export type PageMetrics = {
  /** 본문 영역 가로 (측정 기준) */
  contentW: number;
  /** 본문 영역 세로 (한 장에 담을 수 있는 높이) */
  contentH: number;
  /** 블록 사이 간격 */
  gap: number;
  /** 글 첫 장의 머리(날짜·단어) 높이 + 아래 여백 */
  headH: number;
};

/**
 * 측정된 블록 높이로 글들을 장 단위로 나눈다.
 * 세로 flex + gap 배치에서는 각 블록 높이가 형제와 무관하므로
 * 합계 계산만으로 정확한 분할이 된다.
 *
 * 규칙: 글은 언제나 새 장에서 시작한다.
 */
export function paginate(
  entries: Entry[],
  heights: number[][],
  m: PageMetrics
): Leaf[] {
  if (m.contentH <= 0) return [];

  const leaves: Leaf[] = [];

  entries.forEach((entry, entryIndex) => {
    const h = heights[entryIndex] ?? [];
    const start = leaves.length;
    let i = 0;
    let pageInEntry = 0;

    do {
      const budget = m.contentH - (pageInEntry === 0 ? m.headH : 0);
      const taken: Entry["blocks"] = [];
      let used = 0;

      while (i < entry.blocks.length) {
        const bh = h[i] ?? 0;
        const add = taken.length === 0 ? bh : m.gap + bh;
        // 한 블록이 장보다 커도 최소 하나는 실어 보낸다 (무한 루프 방지)
        if (used + add > budget && taken.length > 0) break;
        used += add;
        taken.push(entry.blocks[i]);
        i += 1;
      }

      leaves.push({ blocks: taken, entryIndex, pageInEntry, entryPageCount: 0 });
      pageInEntry += 1;
    } while (i < entry.blocks.length);

    const total = leaves.length - start;
    for (let k = start; k < leaves.length; k += 1) leaves[k].entryPageCount = total;
  });

  return leaves;
}

/** 펼침면은 짝수 장이어야 한다. 마지막에 빈 장을 덧댄다. */
export function padToSpreads(leaves: Leaf[]): Leaf[] {
  if (leaves.length === 0) return leaves;
  if (leaves.length % 2 === 0) return leaves;
  const last = leaves[leaves.length - 1];
  return [
    ...leaves,
    { blocks: [], entryIndex: last.entryIndex, pageInEntry: -1, entryPageCount: 0 },
  ];
}

/** 특정 글의 첫 장 번호 */
export function firstLeafOfEntry(leaves: Leaf[], entryIndex: number): number {
  const found = leaves.findIndex(
    (l) => l.entryIndex === entryIndex && l.pageInEntry === 0
  );
  return found === -1 ? 0 : found;
}
