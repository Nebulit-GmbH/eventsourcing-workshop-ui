import { Layout } from '@/components/layout/Layout';
import { ReservationCard } from '@/components/borrowing/ReservationCard';
import { UserSelector } from '@/components/borrowing/UserSelector';
import { useBorrowingStore } from '@/store/borrowingStore';
import { toast } from 'sonner';
import { BookOpen } from 'lucide-react';
import {useNotificationAll} from "@/hooks/useNotification.tsx";

export default function CustomerBorrowings() {
  const { getAllReservations, markLost, markDamaged, getCurrentUser } = useBorrowingStore();
  const currentUser = getCurrentUser();
  
  const borrowings = getAllReservations().filter(
    (r) => r.userId === currentUser.userId && r.status === 'picked_up'
  );

    useNotificationAll(()=>{
        // refresh
    })

  const handleMarkLost = (reservationId: string, bookId: string) => {
    markLost(reservationId, bookId, currentUser.userId);
    toast.error('Book marked as lost');
  };

  const handleMarkDamaged = (reservationId: string, bookId: string) => {
    markDamaged(reservationId, bookId, currentUser.userId);
    toast.warning('Book marked as damaged');
  };

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">
              My Borrowings
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage your currently borrowed books
            </p>
          </div>
          <UserSelector />
        </div>

        {borrowings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-xl font-medium text-foreground">
              No active borrowings
            </h3>
            <p className="text-muted-foreground mt-2">
              You don't have any books borrowed at the moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {borrowings.map((reservation) => (
              <ReservationCard
                key={reservation.reservationId}
                reservation={reservation}
                showActions
                onMarkLost={() => handleMarkLost(reservation.reservationId, reservation.bookId)}
                onMarkDamaged={() => handleMarkDamaged(reservation.reservationId, reservation.bookId)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
