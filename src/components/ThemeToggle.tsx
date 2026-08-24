"use client";

import { useEffect, useState } from "react";

type Theme = "day" | "night";

const KEY = "mg:theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = document.documentElement.getAttribute("data-theme");
    if (stored === "day" || stored === "night") {
      setTheme(stored);
      return;
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "night" : "day");
  }, []);

  function toggle() {
    const next: Theme = theme === "night" ? "day" : "night";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // 저장 못 해도 이번 세션 동안은 적용된다
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="grid size-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-paper hover:text-ink"
      aria-label={theme === "night" ? "낮의 종이로" : "밤의 종이로"}
      title={theme === "night" ? "낮의 종이로" : "밤의 종이로"}
    >
      {theme === "night" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.05rem]" aria-hidden="true">
      <path
        d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.05rem]" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="4.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6" />
      </g>
    </svg>
  );
}
