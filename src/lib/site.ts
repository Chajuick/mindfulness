/**
 * 사이트가 어디에 서 있는지.
 *
 * OG 이미지 주소, canonical, sitemap 은 모두 절대 주소여야 한다.
 * 배포처를 옮기면 NEXT_PUBLIC_SITE_URL 하나만 갈아끼우면 된다.
 * Vercel 위에서는 프로젝트 도메인이 자동으로 들어오므로 대개 비워둬도 된다.
 */
function resolveOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE = {
  url: resolveOrigin(),
  name: "마음공부",
  /** 설치했을 때 아이콘 아래 들어갈 짧은 이름 */
  shortName: "마음공부",
  author: "Chajuick",
  description:
    "단어 하나에서 출발한 생각이 어디까지 가는지 적어나가는 일기. 한 권이 한 단어이고, 하루가 한 장입니다.",
  tagline: "단어에 스치는 날들을 쌓아갑니다.",
  locale: "ko_KR",
} as const;

export const abs = (path: string) => new URL(path, SITE.url).toString();
