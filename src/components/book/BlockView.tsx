import type { Block } from "@/lib/types";

/**
 * **강조**만 처리한다. 본문에 필요한 유일한 인라인 표기라서
 * 마크다운 파서를 통째로 들이지 않았다.
 */
function inline(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="emph">
        {part}
      </em>
    ) : (
      part
    )
  );
}

/** 한 블록. 조판이 측정과 완전히 동일해야 하므로 측정기와 이 컴포넌트를 공유한다. */
export function BlockView({ block }: { block: Block }) {
  if (block.kind === "quote") {
    return (
      <blockquote
        className="whitespace-pre-line border-l border-gilt/50 pl-4 font-display text-[0.98em] leading-[1.95] text-ink-2 sm:pl-5"
        style={{ letterSpacing: "0.005em" }}
      >
        {inline(block.text)}
      </blockquote>
    );
  }

  return <p className="whitespace-pre-line text-ink">{inline(block.text)}</p>;
}
