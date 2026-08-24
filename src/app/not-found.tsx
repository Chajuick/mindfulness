import Link from "next/link";
import { Flourish } from "@/components/ui/Flourish";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-[2rem] text-ink" style={{ fontWeight: 700 }}>
        빈 장
      </p>
      <Flourish className="mt-6" />
      <p className="mt-6 text-[0.875rem] leading-relaxed text-ink-2">
        찾으시는 장이 없습니다. 아직 적지 않은 것일지도 모르겠습니다.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-rule px-5 py-2 text-[0.8125rem] text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
      >
        서재로
      </Link>
    </div>
  );
}
