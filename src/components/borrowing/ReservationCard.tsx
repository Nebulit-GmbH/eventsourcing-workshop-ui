import { BookOpen, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Reservation } from '@/types/borrowing';
import { useCatalogEntry } from '@/hooks/useCatalog';
import { useConfirmedAccounts } from '@/hooks/useAccount';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ReservationCardProps {
  reservation: Reservation;
  showActions?: boolean;
  onPickUp?: () => void;
  onMarkLost?: () => void;
  onMarkDamaged?: () => void;
}

const statusConfig = {
  active: { label: 'Active', icon: Clock, variant: 'default' as const, color: 'text-primary' },
  picked_up: { label: 'Picked Up', icon: CheckCircle, variant: 'secondary' as const, color: 'text-green-600' },
  expired: { label: 'Expired', icon: XCircle, variant: 'destructive' as const, color: 'text-destructive' },
  lost: { label: 'Lost', icon: AlertTriangle, variant: 'destructive' as const, color: 'text-destructive' },
  damaged: { label: 'Damaged', icon: AlertTriangle, variant: 'outline' as const, color: 'text-amber-600' },
};

// Mock users for fallback
const MOCK_USERS = [
  { userId: 'user-1', email: 'alice@example.com', name: 'Alice Johnson' },
  { userId: 'user-2', email: 'bob@example.com', name: 'Bob Smith' },
  { userId: 'user-3', email: 'carol@example.com', name: 'Carol Williams' },
];

export function ReservationCard({
  reservation,
  showActions = false,
  onPickUp,
  onMarkLost,
  onMarkDamaged
}: ReservationCardProps) {
  const { data: book } = useCatalogEntry(reservation.bookId);
  const { data: confirmedAccounts } = useConfirmedAccounts();

  // Find user from confirmed accounts or mock users
  const users = confirmedAccounts && confirmedAccounts.length > 0
    ? confirmedAccounts.map(a => ({ userId: a.user_id, name: a.name }))
    : MOCK_USERS;
  const user = users.find((u) => u.userId === reservation.userId);

  const config = statusConfig[reservation.status];
  const StatusIcon = config.icon;

  return (
    <Card className="transition-all duration-200 hover:shadow-elegant">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10")}>
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-serif">
                {book?.title || 'Unknown Book'}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Reserved by: {user?.name || 'Unknown User'}
              </p>
            </div>
          </div>
          <Badge variant={config.variant} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Reservation ID</p>
            <p className="font-medium">{reservation.reservationId}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Created</p>
            <p className="font-medium">
              {format(new Date(reservation.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
          {reservation.borrowDate && (
            <div className="col-span-2">
              <p className="text-muted-foreground">Borrow Date</p>
              <p className="font-medium">
                {format(new Date(reservation.borrowDate), 'MMM d, yyyy')}
              </p>
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2 pt-2">
            {reservation.status === 'active' && onPickUp && (
              <Button onClick={onPickUp} size="sm" className="flex-1">
                Mark Picked Up
              </Button>
            )}
            {reservation.status === 'picked_up' && (
              <>
                {onMarkLost && (
                  <Button onClick={onMarkLost} size="sm" variant="destructive" className="flex-1">
                    Mark Lost
                  </Button>
                )}
                {onMarkDamaged && (
                  <Button onClick={onMarkDamaged} size="sm" variant="outline" className="flex-1">
                    Mark Damaged
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
