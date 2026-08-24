import type { Block } from "@/lib/types";

/** 한 블록. 조판이 측정과 완전히 동일해야 하므로 측정기와 이 컴포넌트를 공유한다. */
export function BlockView({ block }: { block: Block }) {
  if (block.kind === "quote") {
    return (
      <blockquote
        className="border-l border-gilt/50 pl-4 font-display text-[0.98em] leading-[1.95] text-ink-2 whitespace-pre-line sm:pl-5"
        style={{ letterSpacing: "0.005em" }}
      >
        {block.text}
      </blockquote>
    );
  }

  return <p className="whitespace-pre-line text-ink">{block.text}</p>;
}
