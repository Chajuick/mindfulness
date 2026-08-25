import { NextResponse } from "next/server";
import { getBooks } from "@/lib/content";
import { countOf, openBook } from "@/lib/views";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

/**
 * 아무 값이나 저장소에 쓰이지 않도록 실제로 있는 권인지 먼저 확인한다.
 * 없는 슬러그를 그대로 키로 삼으면 누구나 임의의 키를 만들 수 있다.
 */
async function resolve(params: Params["params"]): Promise<string | null> {
  const { slug } = await params;
  return getBooks().some((book) => book.slug === slug) ? slug : null;
}

export async function GET(_request: Request, { params }: Params) {
  const slug = await resolve(params);
  if (!slug) return NextResponse.json({ error: "없는 권입니다" }, { status: 404 });
  return NextResponse.json({ views: await countOf(slug) });
}

export async function POST(_request: Request, { params }: Params) {
  const slug = await resolve(params);
  if (!slug) return NextResponse.json({ error: "없는 권입니다" }, { status: 404 });
  return NextResponse.json({ views: await openBook(slug) });
}
