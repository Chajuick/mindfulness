import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule/60 bg-shelf/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="group flex items-baseline gap-2 no-underline"
          aria-label="마음공부 홈"
        >
          <span
            className="font-display text-[1.0625rem] tracking-[0.16em] text-ink"
            style={{ fontWeight: 700 }}
          >
            마음공부
          </span>
          <span className="hidden text-[0.6875rem] tracking-[0.2em] text-ink-3 sm:inline">
            心工夫
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/write"
            className="rounded-full px-3.5 py-1.5 text-[0.8125rem] text-ink-2 transition-colors hover:bg-paper hover:text-ink"
          >
            쓰기
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
