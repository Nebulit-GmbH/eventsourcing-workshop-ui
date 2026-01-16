import { Layout } from '@/components/layout/Layout';
import { ReservationCard } from '@/components/borrowing/ReservationCard';
import { useBorrowingStore } from '@/store/borrowingStore';
import { toast } from 'sonner';
import { Clock } from 'lucide-react';

export default function ActiveReservations() {
  const { getAllReservations, markPickedUp, getCurrentUser } = useBorrowingStore();
  const currentUser = getCurrentUser();
  
  const activeReservations = getAllReservations().filter((r) => r.status === 'active');

  const handlePickUp = (reservationId: string) => {
    markPickedUp(reservationId, currentUser.userId);
    toast.success('Reservation marked as picked up');
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

        {activeReservations.length === 0 ? (
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
                onPickUp={() => handlePickUp(reservation.reservationId)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
