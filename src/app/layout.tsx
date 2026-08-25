import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: {
    default: "마음공부",
    template: "%s · 마음공부",
  },
  description:
    "단어 하나에서 출발한 생각이 어디까지 가는지 적어나가는 일기. 한 권이 한 단어에서 시작합니다.",
  openGraph: {
    title: "마음공부",
    description: "단어 하나에서 출발한 생각이 어디까지 가는지 적어나가는 일기.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0e8da" },
    { media: "(prefers-color-scheme: dark)", color: "#141312" },
  ],
};

/** 첫 페인트 전에 테마를 확정해 깜빡임을 막는다. */
const THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem("mg:theme");if(t==="day"||t==="night"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Noto+Serif+KR:wght@300;400;500;600&display=swap"
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body className="min-h-dvh antialiased">
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
