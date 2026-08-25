// 아이콘 원본. 여기서 SVG 하나를 만들고 필요한 크기의 PNG를 굽는다.
// 결과물(public/*.png, public/icon.svg, src/app/favicon.ico)은 커밋해 두므로
// 빌드에는 이 스크립트가 필요 없다. 모양을 고칠 때만 `node scripts/gen-icons.mjs`.
import { ImageResponse } from "next/og.js";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const CLOTH = "#7c4a33"; // 표지 천. 낮이든 밤이든 색이 변하지 않는다
const CLOTH_DEEP = "#5f3626"; // 등 쪽 그늘
const GILT = "#c9a969";
const PAGE = "#f6efe1";
const PAGE_EDGE = "#ddd0b8";

/** 책 한 권과 그 위의 하트. viewBox 512. inset을 주면 마스커블 안전영역으로 줄어든다. */
function book(inset = 0) {
  const s = (512 - inset * 2) / 512;
  return `<g transform="translate(${inset} ${inset}) scale(${s})">
    <g transform="translate(2 -4)">
      <rect x="150" y="104" width="270" height="308" rx="10" fill="${PAGE}"/>
      <rect x="150" y="104" width="270" height="308" rx="10" fill="none" stroke="${PAGE_EDGE}" stroke-width="4"/>
      <path d="M392 118 v280" stroke="${PAGE_EDGE}" stroke-width="3" opacity="0.8"/>
      <path d="M404 128 v260" stroke="${PAGE_EDGE}" stroke-width="3" opacity="0.55"/>
      <rect x="96" y="86" width="288" height="340" rx="16" fill="${CLOTH}"/>
      <path d="M96 102 a16 16 0 0 1 16-16 h34 v340 h-34 a16 16 0 0 1-16-16 z" fill="${CLOTH_DEEP}"/>
      <path d="M158 86 v340" stroke="${GILT}" stroke-width="3" opacity="0.5"/>
      <rect x="182" y="118" width="176" height="276" rx="6" fill="none" stroke="${GILT}" stroke-width="4" opacity="0.65"/>
      <g transform="translate(270 222) scale(1.34) translate(-50 -46)">
        <path d="M50 90 C50 90 6 60 6 32 C6 14 19 3 33 3 C42 3 48 8 50 15 C52 8 58 3 67 3 C81 3 94 14 94 32 C94 60 50 90 50 90 Z" fill="${GILT}"/>
      </g>
      <path d="M228 330 h84" stroke="${GILT}" stroke-width="7" stroke-linecap="round" opacity="0.85"/>
      <path d="M246 356 h48" stroke="${GILT}" stroke-width="7" stroke-linecap="round" opacity="0.6"/>
    </g>
  </g>`;
}

const svg = (inner, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">` +
  (bg ? `<rect width="512" height="512" rx="0" fill="${bg}"/>` : "") +
  inner +
  `</svg>`;

const ROOT = process.cwd();
const pub = (f) => join(ROOT, "public", f);

async function png(svgText, size) {
  const src = `data:image/svg+xml;base64,${Buffer.from(svgText).toString("base64")}`;
  const res = new ImageResponse(
    {
      type: "div",
      props: {
        style: { display: "flex", width: size, height: size },
        children: {
          type: "img",
          props: {
            src,
            width: size,
            height: size,
            style: { width: size, height: size },
          },
        },
      },
    },
    { width: size, height: size }
  );
  return Buffer.from(await res.arrayBuffer());
}

/** ICO는 PNG를 그대로 품을 수 있다. 헤더 22바이트만 앞에 붙이면 된다. */
function ico(pngBuf, size) {
  const head = Buffer.alloc(22);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(1, 4);
  head.writeUInt8(size >= 256 ? 0 : size, 6);
  head.writeUInt8(size >= 256 ? 0 : size, 7);
  head.writeUInt8(0, 8);
  head.writeUInt8(0, 9);
  head.writeUInt16LE(1, 10);
  head.writeUInt16LE(32, 12);
  head.writeUInt32LE(pngBuf.length, 14);
  head.writeUInt32LE(22, 18);
  return Buffer.concat([head, pngBuf]);
}

const plain = svg(book(0));
const onPaper = svg(book(24), "#fbf7ef");
const maskable = svg(book(78), "#f4eee2");

writeFileSync(pub("icon.svg"), plain);
writeFileSync(pub("icon-192.png"), await png(onPaper, 192));
writeFileSync(pub("icon-512.png"), await png(onPaper, 512));
writeFileSync(pub("icon-maskable-512.png"), await png(maskable, 512));
writeFileSync(pub("apple-touch-icon.png"), await png(onPaper, 180));
writeFileSync(join(ROOT, "src", "app", "favicon.ico"), ico(await png(onPaper, 48), 48));
console.info("icons written");
