import type { Book, Leaf } from "@/lib/types";
import type { Metrics } from "@/lib/layout";
import { Page, type PageVariant } from "./Page";
import { PageBody } from "./PageBody";

/**
 * 한 장의 앞면 또는 뒷면. Spread와 Slider가 함께 쓴다.
 *
 * 기둥제목은 책의 관례를 따른다. 왼쪽 면에는 책 이름, 오른쪽 면에는
 * 그 장의 날짜. 쪽수 표시를 함께 늘어놓으면 판면이 어수선해진다.
 */
export function LeafFace({
  leaf,
  book,
  variant,
  folio,
  type,
}: {
  leaf: Leaf | undefined;
  book: Book;
  variant: PageVariant;
  folio: number;
  type: Metrics;
}) {
  if (!leaf || leaf.pageInEntry === -1) {
    return <Page variant={variant} />;
  }

  const entry = book.entries[leaf.entryIndex];
  const head = variant === "left" ? book.word : entry.label;

  return (
    <Page
      variant={variant}
      runningHead={leaf.pageInEntry === 0 ? undefined : head}
      folio={folio}
    >
      <PageBody
        blocks={leaf.blocks}
        entry={entry}
        showHead={leaf.pageInEntry === 0}
        metrics={type}
      />
    </Page>
  );
}
