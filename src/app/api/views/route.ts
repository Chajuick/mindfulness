import { NextResponse } from "next/server";
import { getBooks } from "@/lib/content";
import { countsOf } from "@/lib/views";

export const dynamic = "force-dynamic";

/** 서재 화면이 한 번에 가져가는 권별 누적 횟수 */
export async function GET() {
  const counts = await countsOf(getBooks().map((book) => book.slug));
  return NextResponse.json({ counts });
}
