import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { countChars, labelFromIso, makeExcerpt, parseBlocks } from "./parse";
import type { Book, Entry } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

/** YAML의 날짜 값을 "YYYY-MM-DD"로. Date로 파싱된 경우 UTC 기준으로 읽어 하루 밀림을 막는다. */
function toIso(value: unknown, fallbackYear: number, fileLabel: string): string {
  if (value instanceof Date) {
    const y = value.getUTCFullYear();
    const m = `${value.getUTCMonth() + 1}`.padStart(2, "0");
    const d = `${value.getUTCDate()}`.padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }
  // 프론트매터에 날짜가 없으면 파일명(MM.DD)에서 유추한다.
  const [m, d] = fileLabel.split(".");
  if (m && d) return `${fallbackYear}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  return `${fallbackYear}-01-01`;
}

function readBook(dirName: string): Book | null {
  const dir = path.join(CONTENT_DIR, dirName);
  if (!fs.statSync(dir).isDirectory()) return null;

  const metaPath = path.join(dir, "_book.md");
  const meta = fs.existsSync(metaPath)
    ? matter(fs.readFileSync(metaPath, "utf8")).data
    : {};

  const word = typeof meta.word === "string" ? meta.word : dirName;
  const slug = typeof meta.slug === "string" ? meta.slug : dirName;
  const hue = typeof meta.hue === "number" ? meta.hue : hashHue(word);
  // 20%를 넘기면 곧바로 UI 카드처럼 보인다. 낮추는 쪽만 열어둔다.
  const sat = typeof meta.sat === "number" ? Math.min(Math.max(meta.sat, 0), 20) : 17;
  const fallbackYear =
    typeof meta.year === "number" ? meta.year : new Date().getFullYear();

  const entries: Entry[] = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((file) => {
      const label = file.replace(/\.md$/, "");
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      const date = toIso(data.date, fallbackYear, label);
      const blocks = parseBlocks(content);
      const [y, m, d] = date.split("-").map(Number);
      return {
        bookSlug: slug,
        word,
        label: labelFromIso(date),
        date,
        year: y,
        month: m,
        day: d,
        blocks,
        chars: countChars(blocks),
        excerpt: makeExcerpt(blocks),
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  if (entries.length === 0) return null;

  return {
    word,
    slug,
    subtitle: typeof meta.subtitle === "string" ? meta.subtitle : undefined,
    hue,
    sat,
    sample: meta.sample === true,
    entries,
    firstDate: entries[0].date,
    lastDate: entries[entries.length - 1].date,
  };
}

/** 단어에서 안정적인 표지 색을 뽑는다. hue가 지정되지 않은 권용. */
function hashHue(word: string): number {
  let h = 0;
  for (let i = 0; i < word.length; i += 1) h = (h * 31 + word.charCodeAt(i)) % 360;
  return h;
}

export function getBooks(): Book[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((name) => !name.startsWith("_") && !name.startsWith("."))
    .map(readBook)
    .filter((b): b is Book => b !== null)
    .sort((a, b) => b.lastDate.localeCompare(a.lastDate));
}

export function getBook(slug: string): Book | undefined {
  return getBooks().find((b) => b.slug === slug);
}

/** 모든 글을 최신순으로. 연대기 화면용. */
export function getAllEntries(): Entry[] {
  return getBooks()
    .flatMap((b) => b.entries)
    .sort((a, b) => b.date.localeCompare(a.date));
}
