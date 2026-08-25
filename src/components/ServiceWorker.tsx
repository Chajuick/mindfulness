"use client";

import { useEffect } from "react";

/** 설치해서 쓰는 사람을 위한 캐시. 개발 중에는 붙이지 않는다. */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // 캐시는 덤이다. 등록에 실패해도 읽는 데는 지장이 없다.
      });
    };
    if (document.readyState === "complete") register();
    else {
      window.addEventListener("load", register);
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
