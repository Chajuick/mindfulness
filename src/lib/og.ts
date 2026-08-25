/**
 * OG 이미지 재료.
 *
 * satori는 woff2를 읽지 못한다. 구글 폰트에 구형 UA로 요청하면 truetype을
 * 내려주므로 그것을 받아 쓴다. text= 로 쓰인 글자만 잘라 받기 때문에
 * 한글이어도 수십 KB에 그친다 — 한글 전체를 받으면 수 MB다.
 *
 * 망에 닿지 못하면 null을 돌려주고, 부르는 쪽은 글자 없는 판으로 물러선다.
 * OG 이미지 하나 때문에 빌드가 무너지면 안 된다.
 */
import fs from "node:fs";
import path from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const LEGACY_UA = "Mozilla/5.0 (Windows NT 6.1)";

type Loaded = { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" };

async function subset(
  family: string,
  weight: 400 | 700,
  text: string
): Promise<Loaded | null> {
  try {
    const query = `family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await fetch(`https://fonts.googleapis.com/css2?${query}`, {
      headers: { "User-Agent": LEGACY_UA },
    }).then((r) => (r.ok ? r.text() : null));
    if (!css) return null;
    const url = css.match(/src:\s*url\((https:\/\/[^)]+)\)/)?.[1];
    if (!url) return null;
    const res = await fetch(url);
    if (!res.ok) return null;
    return { name: family, data: await res.arrayBuffer(), weight, style: "normal" };
  } catch {
    // 폰트를 못 받으면 글자 없는 판으로 물러선다. 아래 ogFonts()가 빈 배열을 준다.
    return null;
  }
}

/** 이 이미지에 실제로 찍히는 글자만 모아 두 굵기를 받아온다. */
export async function ogFonts(text: string): Promise<Loaded[]> {
  const chars = Array.from(new Set(Array.from(text))).join("");
  const [bold, regular] = await Promise.all([
    subset("Gowun Batang", 700, chars),
    subset("Gowun Batang", 400, chars),
  ]);
  return [bold, regular].filter((f): f is Loaded => f !== null);
}

export const OG_PAPER = "#fbf7ef";
export const OG_INK = "#26221d";
export const OG_INK_2 = "#5c544a";
export const OG_INK_3 = "#918777";
export const OG_RULE = "#ded4c2";

/**
 * 표지에 찍는 책 그림. public/icon.svg 를 그대로 가져다 쓴다.
 * node:fs 를 쓰므로 OG 라우트(서버)에서만 부른다.
 */
export function markDataUri(): string {
  const svg = fs.readFileSync(path.join(process.cwd(), "public", "icon.svg"), "utf8");
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
