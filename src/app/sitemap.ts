import type { MetadataRoute } from "next";
import { getBooks } from "@/lib/content";
import { abs } from "@/lib/site";

/** 초고를 적는 /write 는 넣지 않는다. 검색으로 닿을 화면이 아니다. */
export default function sitemap(): MetadataRoute.Sitemap {
  const books = getBooks();
  const newest = books
    .map((b) => b.lastDate)
    .sort()
    .at(-1);

  return [
    {
      url: abs("/"),
      lastModified: newest ? new Date(newest) : new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...books.map((book) => ({
      url: abs(`/book/${book.slug}`),
      lastModified: new Date(book.lastDate),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
