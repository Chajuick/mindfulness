import type { CSSProperties } from "react";
import type { Block, Entry } from "@/lib/types";
import type { Metrics } from "@/lib/layout";
import { BlockRow } from "./BlockView";
import { EntryHead } from "./EntryHead";

/**
 * 한 장의 본문.
 *
 * 문단 사이를 정확히 한 행간만큼 띄운다. 어중간한 값을 쓰면 문단이
 * 바뀔 때마다 줄이 그리드에서 밀려, 펼침면 좌우의 줄 높이가 어긋난다.
 */
export function PageBody({
  blocks,
  entry,
  showHead,
  metrics,
}: {
  blocks: Block[];
  entry: Entry;
  showHead: boolean;
  metrics: Metrics;
}) {
  const type = {
    "--fs": `${metrics.fontSize}px`,
    "--lh": `${metrics.leading}px`,
  } as CSSProperties;

  return (
    <div className="flex h-full flex-col">
      {showHead && (
        <EntryHead
          entry={entry}
          height={metrics.headHeight}
          leading={metrics.leading}
        />
      )}
      <div className="prose-diary flex flex-col" style={type}>
        {blocks.map((block, i) => (
          <BlockRow key={i} block={block} first={i === 0} leading={metrics.leading} />
        ))}
      </div>
    </div>
  );
}
