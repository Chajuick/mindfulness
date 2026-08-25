import { ImageResponse } from "next/og";
import { getBook, getBooks } from "@/lib/content";
import { boards } from "@/lib/covers";
import { SITE } from "@/lib/site";
import {
  OG_CONTENT_TYPE,
  OG_INK,
  OG_INK_2,
  OG_INK_3,
  OG_PAPER,
  OG_RULE,
  OG_SIZE,
  markDataUri,
  ogFonts,
} from "@/lib/og";

export const alt = SITE.name;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getBooks().map((book) => ({ slug: book.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = getBook(slug);
  const word = book?.word ?? SITE.name;
  const subtitle = book?.subtitle ?? "";
  const count = book?.entries.length ?? 0;
  // 한 장뿐인 권에 "08.24 – 08.24"라고 적으면 어색하다
  const span =
    count > 1
      ? `${book?.entries[0].label} – ${book?.entries[count - 1].label}`
      : (book?.entries[0]?.label ?? "");
  const meta = book ? `${count}장 · ${span}` : "";
  const c = boards(book?.hue ?? 30, book?.sat ?? 17);

  const fonts = await ogFonts(`${SITE.name}${word}${subtitle}${meta}`);
  const hasText = fonts.length > 0;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 76,
        background: OG_PAPER,
        fontFamily: "Gowun Batang",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 28,
          right: 28,
          bottom: 28,
          border: `1px solid ${OG_RULE}`,
        }}
      />

      {/* 표지. 서재에 놓인 것과 같은 천, 같은 금박이다. */}
      <div
        style={{
          display: "flex",
          width: 306,
          height: 438,
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 24px 48px rgba(28,18,8,0.22)",
        }}
      >
        <div style={{ display: "flex", width: 15, background: c.spine }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "108px 26px 26px",
            background: c.face,
          }}
        >
          {hasText && (
            <div
              style={{
                fontSize: 40,
                fontWeight: 700,
                letterSpacing: 2,
                color: c.foil,
              }}
            >
              {word}
            </div>
          )}
        </div>
      </div>

      {hasText && (
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 560 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src={markDataUri()} width={34} height={34} alt="" />
            <div style={{ fontSize: 20, letterSpacing: 7, color: OG_INK_3 }}>
              {SITE.name}
            </div>
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: 2,
              color: OG_INK,
            }}
          >
            {word}
          </div>
          {subtitle && (
            <div
              style={{ marginTop: 24, fontSize: 27, lineHeight: 1.6, color: OG_INK_2 }}
            >
              {subtitle}
            </div>
          )}
          <div style={{ marginTop: 30, width: 72, height: 1, background: OG_RULE }} />
          <div style={{ marginTop: 26, fontSize: 21, color: OG_INK_3 }}>{meta}</div>
        </div>
      )}
    </div>,
    { ...size, fonts }
  );
}
