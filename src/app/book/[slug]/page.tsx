import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBook, getBooks } from "@/lib/content";
import { BookReader } from "@/components/book/BookReader";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getBooks().map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return {};
  const description =
    book.subtitle ?? `${book.word}이라는 단어를 두고 적은 ${book.entries.length}장.`;
  return {
    title: book.word,
    description,
    openGraph: { title: `${book.word} · 마음공부`, description },
  };
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();
  return <BookReader book={book} />;
}
