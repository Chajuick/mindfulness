"use client";

import { useEffect, useState } from "react";

type Counts = Record<string, number>;

/** 서재 화면: 권별 누적 횟수를 한 번에 받아온다. 없으면 null. */
export function useViews(): Counts | null {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/views")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (alive && data?.counts) setCounts(data.counts as Counts);
      })
      .catch(() => {
        // 저장소를 아직 붙이지 않았으면 숫자를 감춘다
      });
    return () => {
      alive = false;
    };
  }, []);

  return counts;
}

/**
 * 책 화면: 펼쳤다고 기록하고 누적 횟수를 받는다.
 * 같은 세션에서 다시 열면 세지 않는다. 내가 몇 번 들락거렸는지까지
 * 세면 숫자가 금세 뜻을 잃는다.
 */
export function useOpenCount(slug: string): number | null {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    const mark = `mg:opened:${slug}`;

    let seen = false;
    try {
      seen = sessionStorage.getItem(mark) === "1";
    } catch {
      // 세션 저장소를 못 쓰면 매번 세는 셈 친다
    }

    fetch(`/api/views/${encodeURIComponent(slug)}`, {
      method: seen ? "GET" : "POST",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (alive && typeof data?.views === "number") setViews(data.views);
        if (!seen) {
          try {
            sessionStorage.setItem(mark, "1");
          } catch {
            // 표시를 못 남겨도 이번 요청은 이미 기록됐다
          }
        }
      })
      .catch(() => {
        // 저장소가 없거나 닿지 않으면 숫자를 감춘다
      });

    return () => {
      alive = false;
    };
  }, [slug]);

  return views;
}
