import { mockBooks } from "@/data/mockData";
import BookDetailClient from "./BookDetailClient";

export function generateStaticParams() {
  return mockBooks.map((book) => ({ id: book.id }));
}

interface Props {
  params: { id: string };
}

export default function BookDetailPage({ params }: Props) {
  const book = mockBooks.find((b) => b.id === params.id);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">کتاب پیدا نشد.</p>
      </div>
    );
  }

  return <BookDetailClient book={book} />;
}
