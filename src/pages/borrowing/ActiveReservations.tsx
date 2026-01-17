import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ReservationCard } from '@/components/borrowing/ReservationCard';
import { useActiveReservations, useBorrowingActions, borrowingKeys } from '@/hooks/useBorrowing';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Clock } from 'lucide-react';
import { useNotificationAll } from "@/hooks/useNotification.tsx";
import { useQueryClient } from '@tanstack/react-query';
import { Reservation } from '@/types/borrowing';

export default function ActiveReservations() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const { data: reservationsData, isLoading } = useActiveReservations();
  const { markPickedUp } = useBorrowingActions();
  const [processingId, setProcessingId] = useState<string | null>(null);

  useNotificationAll(() => {
    queryClient.invalidateQueries({ queryKey: borrowingKeys.all });
  });

  const activeReservations: Reservation[] = (reservationsData || []).map(r => ({
    reservationId: r.reservationId,
    bookId: r.bookId,
    userId: r.userId,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const handlePickUp = async (reservationId: string) => {
    if (!currentUser) {
      toast.error('Please login first');
      return;
    }
    setProcessingId(reservationId);
    try {
      await markPickedUp(reservationId, currentUser.userId);
      toast.success('Reservation marked as picked up');
    } catch (error) {
      toast.error('Failed to mark as picked up');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Active Reservations
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage active book reservations awaiting pickup
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : activeReservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-xl font-medium text-foreground">
              No active reservations
            </h3>
            <p className="text-muted-foreground mt-2">
              All reservations have been processed.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeReservations.map((reservation) => (
              <ReservationCard
                key={reservation.reservationId}
                reservation={reservation}
                showActions
                onPickUp={processingId !== reservation.reservationId ? () => handlePickUp(reservation.reservationId) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
