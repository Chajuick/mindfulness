import type { Block, Entry } from "@/lib/types";
import { BlockView } from "./BlockView";
import { EntryHead } from "./EntryHead";

/** 한 장의 본문. 세로 flex + gap이라 각 블록 높이가 독립적이고, 그래서 측정이 정확하다. */
export function PageBody({
  blocks,
  entry,
  showHead,
  gap,
  headGap,
}: {
  blocks: Block[];
  entry: Entry;
  showHead: boolean;
  gap: number;
  headGap: number;
}) {
  return (
    <div className="flex h-full flex-col">
      {showHead && (
        <div style={{ marginBottom: headGap }}>
          <EntryHead entry={entry} />
        </div>
      )}
      <div className="prose-diary flex flex-col" style={{ gap }}>
        {blocks.map((block, i) => (
          <BlockView key={i} block={block} />
        ))}
      </div>
    </div>
  );
}
