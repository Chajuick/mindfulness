/**
 * 설치해 둔 뒤 지하철에서도 펼쳐지도록 하는 최소한의 캐시.
 *
 * 원칙 두 가지.
 *  1. 글은 늘 새것이 먼저다(network-first). 캐시는 망이 끊겼을 때만 쓴다.
 *     반대로 하면 고쳐 올린 글이 며칠씩 옛 모습으로 남는다.
 *  2. /_next/static 은 파일 이름에 해시가 박혀 있어 내용이 바뀌면 이름이
 *     바뀐다. 그러니 이것만 캐시 우선으로 꺼내 쓴다.
 *
 * 펼친 횟수(/api)는 캐시하지 않는다. 숫자는 옛것을 보여주느니 없는 게 낫다.
 */
const VERSION = "v1";
const PAGES = `mg-pages-${VERSION}`;
const ASSETS = `mg-assets-${VERSION}`;
const SHELL = "/";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGES)
      .then((cache) => cache.add(SHELL))
      .catch(() => undefined) // 서재 한 장 못 받아둔다고 설치를 막지는 않는다
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("mg-") && k !== PAGES && k !== ASSETS)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

const isFont = (url) =>
  url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin && url.pathname.startsWith("/api/")) return;

  // 판면과 글: 새것 먼저, 끊기면 받아둔 것
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(PAGES).then((c) => c.put(req, copy));
          return res;
        })
        .catch(async () => (await caches.match(req)) ?? (await caches.match(SHELL)))
    );
    return;
  }

  // 이름에 해시가 박힌 것들과 글꼴: 받아둔 것 먼저
  const immutable =
    (sameOrigin && url.pathname.startsWith("/_next/static/")) || isFont(url);
  if (!immutable) return;

  event.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ??
        fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(ASSETS).then((c) => c.put(req, copy));
          return res;
        })
    )
  );
});
