import { Layout } from '@/components/layout/Layout';
import { ReservationCard } from '@/components/borrowing/ReservationCard';
import { useActiveReservations } from '@/hooks/useBorrowing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarClock, BookOpen, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNotificationAll } from "@/hooks/useNotification.tsx";
import { Reservation } from '@/types/borrowing';

export default function Reservations() {
  const { data: reservationsData, isLoading, refetch } = useActiveReservations();

  // Refetch on notification
  useNotificationAll(() => {
    refetch();
  });

  // Transform API data to Reservation format
  const allReservations: Reservation[] = (reservationsData || []).map(r => ({
    reservationId: r.reservationId,
    bookId: r.bookId,
    userId: r.userId,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  // Filter by status (API only returns active, so other tabs will be empty)
  const activeReservations = allReservations.filter((r) => r.status === 'active');
  const pickedUpReservations = allReservations.filter((r) => r.status === 'picked_up');
  const expiredReservations = allReservations.filter((r) => r.status === 'expired');
  const problemReservations = allReservations.filter((r) => r.status === 'lost' || r.status === 'damaged');

  const tabs = [
    { value: 'all', label: 'All', count: allReservations.length, icon: BookOpen },
    { value: 'active', label: 'Active', count: activeReservations.length, icon: CalendarClock },
    { value: 'picked_up', label: 'Picked Up', count: pickedUpReservations.length, icon: CheckCircle },
    { value: 'problems', label: 'Problems', count: problemReservations.length, icon: AlertTriangle },
  ];

  const getReservationsByTab = (tab: string) => {
    switch (tab) {
      case 'active':
        return activeReservations;
      case 'picked_up':
        return pickedUpReservations;
      case 'problems':
        return problemReservations;
      default:
        return allReservations;
    }
  };

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Reservations
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage all book reservations
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : (
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="bg-secondary/50 p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex items-center gap-2 data-[state=active]:bg-background"
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {tab.count}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {getReservationsByTab(tab.value).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-serif text-xl font-medium text-foreground">
                      No reservations found
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      {tab.value === 'all'
                        ? 'Reserve a book to see it here.'
                        : `No ${tab.label.toLowerCase()} reservations.`}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {getReservationsByTab(tab.value).map((reservation) => (
                      <ReservationCard
                        key={reservation.reservationId}
                        reservation={reservation}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
