import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ReservationCard } from '@/components/borrowing/ReservationCard';
import { UserSelector } from '@/components/borrowing/UserSelector';
import { useCustomerBorrowings, useBorrowingActions, borrowingKeys } from '@/hooks/useBorrowing';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { BookOpen } from 'lucide-react';
import { useNotificationAll } from "@/hooks/useNotification.tsx";
import { useQueryClient } from '@tanstack/react-query';
import { Reservation } from '@/types/borrowing';

export default function CustomerBorrowings() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const { data: borrowingsData, isLoading } = useCustomerBorrowings();
  const { markLost, markDamaged } = useBorrowingActions();
  const [processingId, setProcessingId] = useState<string | null>(null);

  useNotificationAll(() => {
    queryClient.invalidateQueries({ queryKey: borrowingKeys.all });
  });

  const borrowings: Reservation[] = (borrowingsData || [])
    .filter(b => !currentUser || b.userId === currentUser.userId)
    .map(b => ({
      reservationId: b.reservationId,
      bookId: '',
      userId: b.userId,
      status: 'picked_up' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

  const handleMarkLost = async (reservationId: string, bookId: string) => {
    if (!currentUser) {
      toast.error('Please login first');
      return;
    }
    setProcessingId(reservationId);
    try {
      await markLost(reservationId, bookId, currentUser.userId);
      toast.error('Book marked as lost');
    } catch (error) {
      toast.error('Failed to mark as lost');
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkDamaged = async (reservationId: string, bookId: string) => {
    if (!currentUser) {
      toast.error('Please login first');
      return;
    }
    setProcessingId(reservationId);
    try {
      await markDamaged(reservationId, bookId, currentUser.userId);
      toast.warning('Book marked as damaged');
    } catch (error) {
      toast.error('Failed to mark as damaged');
    } finally {
      setProcessingId(null);
    }
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

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : borrowings.length === 0 ? (
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
                onMarkLost={processingId !== reservation.reservationId ? () => handleMarkLost(reservation.reservationId, reservation.bookId) : undefined}
                onMarkDamaged={processingId !== reservation.reservationId ? () => handleMarkDamaged(reservation.reservationId, reservation.bookId) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
