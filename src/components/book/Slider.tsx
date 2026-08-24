"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import type { Book, Leaf } from "@/lib/types";
import { GAP_MOBILE } from "@/lib/layout";
import { LeafFace } from "./LeafFace";

const SLIDE = {
  duration: 0.46,
  ease: [0.22, 0.61, 0.24, 1] as [number, number, number, number],
};

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "88%" : "-88%",
    opacity: 0.55,
    scale: 0.985,
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-24%" : "24%", opacity: 0, scale: 0.97 }),
};

/** 모바일: 한 장씩 가로로 미끄러진다. 드래그로도 넘길 수 있다. */
export function Slider({
  leaves,
  book,
  index,
  dir,
  onNav,
  width,
  height,
}: {
  leaves: Leaf[];
  book: Book;
  index: number;
  dir: 1 | -1;
  onNav: (d: 1 | -1) => void;
  width: number;
  height: number;
}) {
  function onDragEnd(_: unknown, info: PanInfo) {
    const throw_ = info.offset.x + info.velocity.x * 0.12;
    if (throw_ < -70) onNav(1);
    else if (throw_ > 70) onNav(-1);
  }

  return (
    <div
      className="relative overflow-hidden rounded-[3px] shadow-[0_2px_6px_rgb(var(--shadow-warm)/0.14),0_24px_46px_-22px_rgb(var(--shadow-warm)/0.4)]"
      style={{ width, height }}
    >
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={index}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={SLIDE}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.14}
          onDragEnd={onDragEnd}
          className="absolute inset-0 touch-pan-y"
        >
          <LeafFace
            leaf={leaves[index]}
            book={book}
            variant="single"
            folio={index + 1}
            gap={GAP_MOBILE}
          />
        </motion.div>
      </AnimatePresence>

      {/* 책배 결 */}
      <span
        aria-hidden="true"
        className="fore-edge pointer-events-none absolute inset-y-0 right-0 w-[2px] opacity-60"
      />
    </div>
  );
}
