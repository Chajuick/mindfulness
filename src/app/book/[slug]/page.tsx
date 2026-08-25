import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBook, getBooks } from "@/lib/content";
import { BookReader } from "@/components/book/BookReader";
import { JsonLd } from "@/components/JsonLd";
import { SITE, abs } from "@/lib/site";

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
    keywords: [book.word, SITE.name, "일기", "산문"],
    alternates: { canonical: `/book/${book.slug}` },
    openGraph: {
      type: "article",
      title: `${book.word} · ${SITE.name}`,
      description,
      url: abs(`/book/${book.slug}`),
      siteName: SITE.name,
      locale: SITE.locale,
      publishedTime: book.firstDate,
      modifiedTime: book.lastDate,
      authors: [SITE.author],
    },
    twitter: {
      card: "summary_large_image",
      title: `${book.word} · ${SITE.name}`,
      description,
    },
  };
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();

  const description =
    book.subtitle ?? `${book.word}이라는 단어를 두고 적은 ${book.entries.length}장.`;
  const url = abs(`/book/${book.slug}`);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${url}#page`,
              url,
              name: `${book.word} · ${SITE.name}`,
              headline: book.word,
              description,
              inLanguage: "ko-KR",
              datePublished: book.firstDate,
              dateModified: book.lastDate,
              about: book.word,
              isPartOf: { "@type": "Blog", "@id": abs("/#blog"), name: SITE.name },
              author: { "@type": "Person", name: SITE.author },
              // 장에는 저마다의 주소가 없다. 한 권 안에 얹힌 부분으로만 적는다.
              hasPart: book.entries.map((entry) => ({
                "@type": "BlogPosting",
                headline: `${book.word} · ${entry.label}`,
                datePublished: entry.date,
                articleSection: book.word,
                inLanguage: "ko-KR",
                isPartOf: { "@id": `${url}#page` },
                author: { "@type": "Person", name: SITE.author },
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "서재", item: abs("/") },
                { "@type": "ListItem", position: 2, name: book.word, item: url },
              ],
            },
          ],
        }}
      />
      <BookReader book={book} />
    </>
  );
}
