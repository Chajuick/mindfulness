import type { Metadata } from "next";
import { getBooks } from "@/lib/content";
import { Flourish } from "@/components/ui/Flourish";
import { Composer } from "@/components/write/Composer";

export const metadata: Metadata = {
  title: "쓰기",
  description: "초고를 적고 마크다운으로 내보냅니다.",
};

export default function WritePage() {
  const words = getBooks().map((book) => book.word);

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-12 sm:px-8">
      <header className="text-center">
        <p className="text-[0.6875rem] tracking-[0.32em] text-ink-3">초고</p>
        <h1
          className="mt-3 font-display text-[1.75rem] tracking-tight text-ink"
          style={{ fontWeight: 700 }}
        >
          한 장 적기
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[0.8125rem] leading-[1.9] text-ink-2">
          여기서 쓴 글은 이 브라우저에만 남습니다. 다 다듬은 뒤에 내보내 공개하면
          됩니다.
        </p>
        <Flourish className="mt-6" />
      </header>

      <div className="mt-12">
        <Composer words={words} />
      </div>
    </div>
  );
}
