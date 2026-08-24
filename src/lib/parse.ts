import type { Block } from "./types";

/** 한 블록이 이보다 길면 문장 단위로 쪼갠다. 한 장에 안정적으로 들어가는 분량. */
const MAX_BLOCK_CHARS = 300;

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function starCount(text: string): number {
  return text.match(/\*\*/g)?.length ?? 0;
}

/** 글자수·발췌에서는 강조 표기를 빼고 센다. */
function strip(text: string): string {
  return text.replace(/\*\*/g, "");
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?…”』」])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** 너무 긴 블록을 문장 경계로 나눈다. 이어지는 조각은 cont 표시. */
function chunk(block: Block): Block[] {
  if (block.text.length <= MAX_BLOCK_CHARS) return [block];

  const parts: string[] = [];
  let buf = "";
  for (const sentence of splitSentences(block.text)) {
    const next = buf ? `${buf} ${sentence}` : sentence;
    if (next.length > MAX_BLOCK_CHARS && buf) {
      parts.push(buf);
      buf = sentence;
    } else {
      buf = next;
    }
  }
  if (buf) parts.push(buf);

  // ** 강조가 조각 사이에서 끊기면 별표가 그대로 드러난다. 짝이 맞을 때까지 붙인다.
  const joined: string[] = [];
  for (const part of parts) {
    const last = joined.at(-1);
    if (last !== undefined && starCount(last) % 2 === 1) {
      joined[joined.length - 1] = `${last} ${part}`;
    } else {
      joined.push(part);
    }
  }

  return joined.map((text, i) => ({ ...block, text, cont: i > 0 }));
}

/** 본문 텍스트를 블록 배열로. 빈 줄이 블록 경계, 홑 줄바꿈은 그대로 살린다. */
export function parseBlocks(body: string): Block[] {
  return body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((raw) => raw.replace(/[ \t]+$/gm, "").trim())
    .filter(Boolean)
    .flatMap((text) => {
      if (text.startsWith("> ")) {
        return chunk({ kind: "quote", text: text.replace(/^> ?/gm, "") });
      }
      const isSpokenQuote =
        (text.startsWith("“") && text.endsWith("”")) ||
        (text.startsWith('"') && text.endsWith('"'));
      if (isSpokenQuote && !text.includes("\n\n")) {
        return chunk({ kind: "quote", text });
      }
      return chunk({ kind: "para", text });
    });
}

export function countChars(blocks: Block[]): number {
  return blocks.reduce((n, b) => n + b.text.replace(/\s/g, "").length, 0);
}

export function makeExcerpt(blocks: Block[], max = 90): string {
  const first = blocks.find((b) => b.kind === "para") ?? blocks[0];
  if (!first) return "";
  const flat = first.text.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max)}…` : flat;
}

export function weekdayOf(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return WEEKDAYS[d.getDay()];
}

/** "2026-08-24" -> "08.24" */
export function labelFromIso(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${m}.${d}`;
}
