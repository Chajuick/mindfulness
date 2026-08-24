"use client";

import { motion } from "framer-motion";
import type { Book, Leaf } from "@/lib/types";
import { GAP_DESKTOP } from "@/lib/layout";
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
}: {
  leaves: Leaf[];
  book: Book;
  index: number;
  flip: FlipDir | null;
  onFlipEnd: () => void;
  width: number;
  height: number;
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
      {/* 뒤에 쌓인 종이: 책의 두께 */}
      <Stack side="left" height={height} />
      <Stack side="right" height={height} />

      <div
        className="absolute inset-0 flex overflow-hidden rounded-[2px] shadow-[0_2px_6px_rgb(var(--shadow-warm)/0.14),0_36px_70px_-28px_rgb(var(--shadow-warm)/0.42)]"
        style={{ width: half * 2 }}
      >
        <div style={{ width: half }} className="relative h-full">
          <LeafFace
            leaf={leaves[underLeftAt]}
            book={book}
            variant="left"
            folio={underLeftAt + 1}
            gap={GAP_DESKTOP}
          />
        </div>
        <div style={{ width: half }} className="relative h-full">
          <LeafFace
            leaf={leaves[underRightAt]}
            book={book}
            variant="right"
            folio={underRightAt + 1}
            gap={GAP_DESKTOP}
          />
        </div>
      </div>

      {/* 책등 접힘선 */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 z-20 w-px bg-rule/50"
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
              gap={GAP_DESKTOP}
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
              gap={GAP_DESKTOP}
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
        background: `linear-gradient(to ${origin === "left" ? "right" : "left"}, rgb(var(--shadow-warm) / 0.55), rgb(var(--shadow-warm) / 0.06) 55%, transparent)`,
      }}
      initial={{ opacity: values[0] }}
      animate={{ opacity: values[1] }}
      transition={TURN}
    />
  );
}

function Stack({ side, height }: { side: "left" | "right"; height: number }) {
  const offsets = [3, 6, 9];
  return (
    <>
      {offsets.map((o, i) => (
        <span
          key={o}
          aria-hidden="true"
          className="pointer-events-none absolute w-[46%] rounded-[2px] bg-paper-2"
          style={{
            top: o * 0.7,
            height: height - o * 1.4,
            [side]: -o,
            opacity: 0.55 - i * 0.14,
            boxShadow: "0 1px 2px rgb(var(--shadow-warm) / 0.12)",
          }}
        />
      ))}
    </>
  );
}
