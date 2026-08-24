/** 블록 사이 간격. 측정기와 실제 조판이 같은 값을 써야 분할이 정확하다. */
export const GAP_DESKTOP = 20;
export const GAP_MOBILE = 17;
/** 글 머리(날짜·단어) 아래 여백 */
export const HEAD_GAP = 24;

/** 펼침면 크기. 화면에 맞춰 책 전체 크기를 정한다. */
export function spreadSize(vw: number, vh: number) {
  const width = Math.min(1120, vw - 96);
  const height = Math.min(Math.max(vh - 252, 400), 720);
  return { width, height };
}

/** 모바일 한 장 크기 */
export function singleSize(vw: number, vh: number) {
  const width = Math.min(vw - 32, 520);
  const height = Math.min(Math.max(vh - 232, 400), 760);
  return { width, height };
}
