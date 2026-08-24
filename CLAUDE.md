# 마음공부 — 개발 가이드

## 패키지 관리

- **항상 `pnpm`** (npm, yarn 금지)

```bash
pnpm dev      # 개발 서버
pnpm check    # 타입체크 (tsc --noEmit)
pnpm build    # 정적 생성
pnpm format   # Prettier
```

작업 순서: 코드 → `pnpm check` → `pnpm format` → `pnpm build`

## 이 앱의 성격

일기입니다. **담담함**이 제품의 핵심이라, 요란한 것을 붙이면 망가집니다.

- 애니메이션은 종이의 물성을 흉내 내는 데만 씁니다. 주의를 끌려고 쓰지 않습니다.
- 카피는 짧고 건조하게. 격려하거나 다그치지 않습니다.
- 통계·연속기록·배지 같은 습관 유도 장치는 넣지 않습니다.

## 데이터 흐름

**쓰기와 읽기가 분리되어 있습니다. 이 경계를 흐리지 마세요.**

- 초고 → `localStorage` (`src/lib/drafts.ts`). 절대 서버로 보내지 않습니다.
- 공개된 글 → `content/**.md` → 빌드 시 정적 생성 (`src/lib/content.ts`, 서버 전용)

`src/lib/content.ts`는 `node:fs`를 씁니다. 클라이언트 컴포넌트에서 import하지 마세요.
목록 화면에는 본문 블록을 떼고(`stripBlocks`) `EntryMeta`만 넘깁니다.

## 조판

- `parse.ts` 본문 → 블록 · `paginate.ts` 블록 → 장 · `Measurer.tsx` 실측
- **`Measurer`와 실제 조판은 반드시 같은 컴포넌트(`BlockView`)와 같은 `gap`을 써야 합니다.**
  둘이 어긋나면 장 나눔이 조용히 틀어집니다. 간격 상수는 `src/lib/layout.ts` 한 곳에만 둡니다.
- 세로 flex + gap이라 블록 높이가 형제와 독립적입니다. 이 전제가 깨지면 측정도 깨집니다.
  본문 영역에 `position: absolute`나 음수 마진을 넣지 마세요.

## 스타일

- Tailwind v4. 색은 전부 `globals.css`의 CSS 변수를 거칩니다 (`@theme inline`).
- **색상 리터럴을 컴포넌트에 직접 쓰지 마세요.** 낮/밤 테마가 깨집니다.
  단어별 표지색처럼 동적인 값은 `color-mix(in oklab, hsl(...) N%, var(--paper))`로 종이색과 섞습니다.
- 그림자는 `rgb(var(--shadow-warm) / α)`. 밤에는 `--shadow-warm`이 검정이 됩니다.
- 한국어 본문은 `word-break: keep-all` (body 전역). 어절 중간에서 끊기면 읽기 나빠집니다.

## 코딩 컨벤션

- `type` 선호, `interface` 자제
- `enum` 금지 → 문자열 리터럴 유니온
- `any` 금지
- `console.log` 남기지 않기
- 빈 `catch`에는 왜 무시해도 되는지 한 줄 남기기

## 주석

무엇을 하는지가 아니라 **왜 이렇게 했는지**를 씁니다.
`paginate`, `Measurer`, `Spread`의 회전 유도처럼 다시 읽을 때 헷갈릴 곳에만 답니다.
