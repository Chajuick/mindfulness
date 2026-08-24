import type { Draft } from "./drafts";

/** content/{단어}/{MM.DD}.md 로 그대로 넣을 수 있는 형태로 만든다. */
export function toMarkdown(draft: Draft): string {
  return `---\ndate: ${draft.date}\n---\n\n${draft.body.trim()}\n`;
}

/** "2026-08-24" -> "08.24.md" */
export function fileNameOf(draft: Draft): string {
  const [, m, d] = draft.date.split("-");
  return `${m}.${d}.md`;
}

export function targetPathOf(draft: Draft): string {
  const word = draft.word.trim() || "단어";
  return `content/${word}/${fileNameOf(draft)}`;
}

/** 브라우저에서 파일로 내려준다. */
export function downloadMarkdown(draft: Draft): void {
  const blob = new Blob([toMarkdown(draft)], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileNameOf(draft);
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
