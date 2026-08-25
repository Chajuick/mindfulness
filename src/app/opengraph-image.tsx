import { ImageResponse } from "next/og";
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

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const label = "여정의 발자취";
  const fonts = await ogFonts(label + SITE.name + SITE.tagline);
  const hasText = fonts.length > 0;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
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
      <img src={markDataUri()} width={132} height={132} alt="" />
      {hasText && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              marginTop: 26,
              fontSize: 22,
              letterSpacing: 9,
              color: OG_INK_3,
            }}
          >
            {label}
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: 4,
              color: OG_INK,
            }}
          >
            {SITE.name}
          </div>
          <div
            style={{
              marginTop: 30,
              width: 96,
              height: 1,
              background: OG_RULE,
            }}
          />
          <div style={{ marginTop: 30, fontSize: 30, color: OG_INK_2 }}>
            {SITE.tagline}
          </div>
        </div>
      )}
    </div>,
    { ...size, fonts }
  );
}
