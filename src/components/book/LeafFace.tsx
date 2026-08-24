import type { Book, Leaf } from "@/lib/types";
import { HEAD_GAP } from "@/lib/layout";
import { Page, type PageVariant } from "./Page";
import { PageBody } from "./PageBody";

/** 한 장의 앞면 또는 뒷면. Spread와 Slider가 함께 쓴다. */
export function LeafFace({
  leaf,
  book,
  variant,
  folio,
  gap,
}: {
  leaf: Leaf | undefined;
  book: Book;
  variant: PageVariant;
  folio: number;
  gap: number;
}) {
  if (!leaf || leaf.pageInEntry === -1) {
    return <Page variant={variant} />;
  }

  const entry = book.entries[leaf.entryIndex];
  const continued = leaf.pageInEntry > 0;

  return (
    <Page
      variant={variant}
      runningHead={
        continued ? (
          <span className="flex items-center gap-2">
            <span>{book.word}</span>
            <span className="text-ink-3/70">
              {leaf.pageInEntry + 1}/{leaf.entryPageCount}
            </span>
          </span>
        ) : null
      }
      folio={folio}
    >
      <PageBody
        blocks={leaf.blocks}
        entry={entry}
        showHead={leaf.pageInEntry === 0}
        gap={gap}
        headGap={HEAD_GAP}
      />
    </Page>
  );
}
