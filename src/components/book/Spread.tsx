"use client";

import { motion } from "framer-motion";
import type { Book, Leaf } from "@/lib/types";
import type { Metrics } from "@/lib/layout";
import { LeafFace } from "./LeafFace";

export type FlipDir = 1 | -1;

const TURN = {
  duration: 0.78,
  ease: [0.42, 0.02, 0.24, 1] as [number, number, number, number],
};

/**
 * 펼침면. 넘기는 장은 언제나 오른쪽 절반에 놓고 책등(왼쪽 모서리)을 축으로 돈다.
 *
 *  앞으로: 아래 = (현재 왼쪽, 새 오른쪽) / 도는 장 = 앞면 현재오른쪽, 뒷면 새왼쪽 → 0° → -180°
 *  뒤로  : 아래 = (새 왼쪽, 현재 오른쪽) / 도는 장 = 앞면 새오른쪽, 뒷면 현재왼쪽 → -180° → 0°
 */
export function Spread({
  leaves,
  book,
  index,
  flip,
  onFlipEnd,
  width,
  height,
  type,
}: {
  leaves: Leaf[];
  book: Book;
  index: number;
  flip: FlipDir | null;
  onFlipEnd: () => void;
  width: number;
  height: number;
  type: Metrics;
}) {
  const half = Math.floor(width / 2);

  const underLeftAt = flip === -1 ? index - 2 : index;
  const underRightAt = flip === 1 ? index + 3 : index + 1;
  const frontAt = flip === 1 ? index + 1 : index - 1;
  const backAt = flip === 1 ? index + 2 : index;

  const from = flip === 1 ? 0 : -180;
  const to = flip === 1 ? -180 : 0;
  const frontShade = flip === 1 ? [0, 0.5] : [0.5, 0];
  const backShade = flip === 1 ? [0.5, 0] : [0, 0.5];

  return (
    <div className="book-scene relative" style={{ width, height }}>
      {/* 책배: 닫힌 쪽에서 보이는 종이 단면 */}
      <ForeEdge side="left" height={height} />
      <ForeEdge side="right" height={height} />

      <div
        className="book-shadow absolute inset-0 flex overflow-hidden rounded-[2px]"
        style={{ width: half * 2 }}
      >
        <div style={{ width: half }} className="relative h-full">
          <LeafFace
            leaf={leaves[underLeftAt]}
            book={book}
            variant="left"
            folio={underLeftAt + 1}
            type={type}
          />
        </div>
        <div style={{ width: half }} className="relative h-full">
          <LeafFace
            leaf={leaves[underRightAt]}
            book={book}
            variant="right"
            folio={underRightAt + 1}
            type={type}
          />
        </div>
      </div>

      {/* 책등 접힘선 */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 z-20 w-px bg-rule/45"
        style={{ left: half }}
      />

      {flip !== null && (
        <motion.div
          className="leaf-3d absolute top-0 z-10"
          style={{ left: half, width: half, height, transformOrigin: "left center" }}
          initial={{ rotateY: from }}
          animate={{ rotateY: to }}
          transition={TURN}
          onAnimationComplete={onFlipEnd}
        >
          <div className="leaf-face absolute inset-0 overflow-hidden rounded-r-[2px]">
            <LeafFace
              leaf={leaves[frontAt]}
              book={book}
              variant="right"
              folio={frontAt + 1}
              type={type}
            />
            <Shade values={frontShade} origin="left" />
          </div>
          <div
            className="leaf-face absolute inset-0 overflow-hidden rounded-l-[2px]"
            style={{ transform: "rotateY(180deg)" }}
          >
            <LeafFace
              leaf={leaves[backAt]}
              book={book}
              variant="left"
              folio={backAt + 1}
              type={type}
            />
            <Shade values={backShade} origin="right" />
          </div>
        </motion.div>
      )}
    </div>
  );
}

/** 넘어가는 장에 드리우는 빛과 그늘 */
function Shade({ values, origin }: { values: number[]; origin: "left" | "right" }) {
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        background: `linear-gradient(to ${origin === "left" ? "right" : "left"}, rgb(var(--shadow-warm) / 0.5), rgb(var(--shadow-warm) / 0.05) 55%, transparent)`,
      }}
      initial={{ opacity: values[0] }}
      animate={{ opacity: values[1] }}
      transition={TURN}
    />
  );
}

/**
 * 바깥쪽 모서리에 드러나는 종이 단면. 실제 책에서 보이는 만큼만
 * 얇게 낸다. 넓게 깔면 종이 더미가 아니라 그림자로 보인다.
 */
function ForeEdge({ side, height }: { side: "left" | "right"; height: number }) {
  const slivers = [
    { offset: 2, width: 2, inset: 3 },
    { offset: 4, width: 2, inset: 7 },
    { offset: 6, width: 1, inset: 11 },
  ];
  return (
    <>
      {slivers.map((s, i) => (
        <span
          key={s.offset}
          aria-hidden="true"
          className="fore-edge pointer-events-none absolute rounded-[1px]"
          style={{
            top: s.inset,
            height: height - s.inset * 2,
            width: s.width,
            [side]: -s.offset,
            opacity: 0.7 - i * 0.2,
          }}
        />
      ))}
    </>
  );
}
