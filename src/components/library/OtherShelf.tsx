import { boards } from "@/lib/covers";
import { Flourish } from "@/components/ui/Flourish";

/**
 * 같은 사람이 쓰는 다른 곳으로 가는 문.
 *
 * 책의 판권면처럼 서재 맨 아래에 조용히 둔다. 머리말에 두면 이 서재의
 * 길과 경쟁한다. 색은 적바림 쪽 먹빛(#0c0b0a)에 가깝게 맞췄다.
 */
const SHELVES = [
  {
    title: "적바림",
    blurb: "짧고 선명한 시들",
    href: "https://jeok-balim.vercel.app/",
    hue: 30,
    sat: 3,
  },
] as const;

export function OtherShelf() {
  return (
    <footer className="mx-auto mt-24 max-w-md">
      <Flourish />
      <p className="mt-8 text-center text-[0.625rem] tracking-[0.26em] text-ink-3">
        다른 서가
      </p>

      <ul className="mt-5 space-y-3">
        {SHELVES.map((shelf) => {
          const c = boards(shelf.hue, shelf.sat);
          return (
            <li key={shelf.href}>
              <a
                href={shelf.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${shelf.title} — ${shelf.blurb} (새 창에서 열림)`}
                className="group flex items-stretch gap-4 rounded-[2px] border border-rule/60 bg-paper/50 p-3 transition-colors hover:border-rule hover:bg-paper"
              >
                <span
                  aria-hidden="true"
                  className="relative w-[9px] shrink-0 rounded-[1px]"
                  style={{ background: c.face }}
                >
                  <span className="absolute inset-y-0 right-0 w-px bg-white/10" />
                </span>

                <span className="min-w-0 flex-1 py-0.5">
                  <span className="font-display text-[1rem] text-ink transition-colors group-hover:text-accent">
                    {shelf.title}
                  </span>
                  <span className="mt-1 block text-[0.75rem] text-ink-2">
                    {shelf.blurb}
                  </span>
                </span>

                <span className="self-center text-ink-3 transition-transform group-hover:translate-x-0.5">
                  <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden="true">
                    <path
                      d="M7 17L17 7M17 7H9M17 7v8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </footer>
  );
}
