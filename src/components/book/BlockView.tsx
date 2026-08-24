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
    // 괘선을 두르는 대신 좌우로 들여 짠다. 책에서 인용을 다루는 방식이고,
    // 행간을 물려받아 그리드에서 벗어나지 않는다.
    return (
      <blockquote className="whitespace-pre-line pl-[1.9em] pr-[0.9em] text-[0.94em] text-ink-2">
        {inline(block.text)}
      </blockquote>
    );
  }

  return <p className="whitespace-pre-line text-ink">{inline(block.text)}</p>;
}

/**
 * 블록 한 줄. 위 여백을 문단 경계에서만 준다.
 * 측정기와 판면이 반드시 같은 것을 렌더해야 장 나눔이 어긋나지 않는다.
 */
export function BlockRow({
  block,
  first,
  leading,
}: {
  block: Block;
  first: boolean;
  leading: number;
}) {
  return (
    <div style={{ marginTop: first || block.cont ? 0 : leading }}>
      <BlockView block={block} />
    </div>
  );
}
