"use client";

import { useEffect, useState } from "react";

/** 창 크기. 리사이즈에 맞춰 책 크기를 다시 잡기 위해 쓴다. */
export function useViewport() {
  const [size, setSize] = useState({ vw: 0, vh: 0 });

  useEffect(() => {
    function read() {
      setSize({ vw: window.innerWidth, vh: window.innerHeight });
    }
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  return size;
}
