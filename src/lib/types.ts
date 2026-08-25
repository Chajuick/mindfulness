export type Block =
  | { kind: "para"; text: string; cont?: boolean }
  | { kind: "quote"; text: string; cont?: boolean };

export type Entry = {
  bookSlug: string;
  word: string;
  /** 파일명에서 온 장 이름. 예: "08.24" */
  label: string;
  /** ISO 날짜. 예: "2026-08-24" */
  date: string;
  year: number;
  month: number;
  day: number;
  blocks: Block[];
  chars: number;
  excerpt: string;
};

export type Book = {
  word: string;
  slug: string;
  subtitle?: string;
  /** 표지 색상 (HSL hue, 0-360) */
  hue: number;
  /** 표지 채도(%). 올릴수록 책보다 UI 카드처럼 보인다. */
  sat: number;
  /** 지워도 되는 예시 권 */
  sample: boolean;
  entries: Entry[];
  firstDate: string;
  lastDate: string;
};

/** 한 장(페이지)에 담긴 블록들 */
export type Leaf = {
  blocks: Block[];
  /** 이 장이 속한 글 */
  entryIndex: number;
  /** 글 안에서 몇 번째 장인지 (0부터) */
  pageInEntry: number;
  entryPageCount: number;
};

/** 목록·색인 화면에 넘기는 가벼운 글 정보 (본문 블록 제외) */
export type EntryMeta = Omit<Entry, "blocks">;

/** 목록·색인 화면에 넘기는 가벼운 권 정보 */
export type BookMeta = Omit<Book, "entries"> & { entries: EntryMeta[] };
