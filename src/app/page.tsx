import { getBooks } from "@/lib/content";
import { stripBlocks } from "@/lib/view";
import { Flourish } from "@/components/ui/Flourish";
import { LibraryView } from "@/components/library/LibraryView";

export default function HomePage() {
  const books = getBooks();
  const bookMetas = books.map((b) => ({ ...b, entries: b.entries.map(stripBlocks) }));
  const entries = bookMetas
    .flatMap((b) => b.entries)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-14 sm:px-8 sm:pt-20">
      <header className="mx-auto max-w-xl text-center">
        <p className="text-[0.6875rem] tracking-[0.32em] text-ink-3">한 권이 한 단어</p>
        <h1
          className="mt-4 font-display text-[2rem] leading-[1.35] tracking-tight text-ink sm:text-[2.5rem]"
          style={{ fontWeight: 700 }}
        >
          서재
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[0.875rem] leading-[1.9] text-ink-2">
          단어 하나를 정해두고, 그 단어를 스치는 날들을 담담하게 적습니다.
          <br className="hidden sm:inline" /> 쌓인 장들이 한 권이 됩니다.
        </p>
        <Flourish className="mt-7" />
      </header>

      <div className="mt-12 sm:mt-16">
        {books.length === 0 ? (
          <EmptyLibrary />
        ) : (
          <LibraryView books={bookMetas} entries={entries} />
        )}
      </div>
    </div>
  );
}

function EmptyLibrary() {
  return (
    <div className="mx-auto max-w-md rounded-lg border border-dashed border-rule px-6 py-16 text-center">
      <p className="font-display text-[1.125rem] text-ink">아직 비어 있습니다</p>
      <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-2">
        <code className="rounded bg-paper px-1.5 py-0.5 text-[0.75rem]">
          content/단어/MM.DD.md
        </code>
        <br />
        형태로 파일을 두면 한 장이 됩니다.
      </p>
    </div>
  );
}
