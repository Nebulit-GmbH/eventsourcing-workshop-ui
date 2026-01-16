import { Layout } from '@/components/layout/Layout';
import { BookCard } from '@/components/borrowing/BookCard';
import { UserSelector } from '@/components/borrowing/UserSelector';
import { useBorrowingStore } from '@/store/borrowingStore';
import { toast } from 'sonner';
import { BookOpen } from 'lucide-react';

export default function BooksForRent() {
  const { getBooksForRent, reserveBook, getCurrentUser } = useBorrowingStore();
  const books = getBooksForRent();
  const currentUser = getCurrentUser();

  const handleReserve = (bookId: string, title: string) => {
    reserveBook(bookId, currentUser.userId);
    toast.success(`Reserved "${title}" for ${currentUser.name}`);
  };

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">
              Books for Rent
            </h1>
            <p className="text-muted-foreground mt-1">
              Browse and reserve available books
            </p>
          </div>
          <UserSelector />
        </div>

        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-xl font-medium text-foreground">
              No books available
            </h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Publish catalog entries to make them available for borrowing.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard
                key={book.bookId}
                bookId={book.bookId}
                title={book.title}
                description={book.description}
                isAvailable={book.isAvailable}
                onReserve={book.isAvailable ? () => handleReserve(book.bookId, book.title) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
