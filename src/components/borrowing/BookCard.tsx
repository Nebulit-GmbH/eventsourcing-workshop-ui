import { Book, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BookCardProps {
  bookId: string;
  title: string;
  description: string;
  isAvailable: boolean;
  onReserve?: () => void;
}

export function BookCard({ bookId, title, description, isAvailable, onReserve }: BookCardProps) {
  return (
    <Card className={cn(
      "group transition-all duration-200 hover:shadow-elegant",
      !isAvailable && "opacity-75"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Book className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-serif">{title}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">ID: {bookId}</p>
            </div>
          </div>
          <Badge variant={isAvailable ? 'default' : 'secondary'} className="flex items-center gap-1">
            {isAvailable ? (
              <>
                <Check className="h-3 w-3" />
                Available
              </>
            ) : (
              <>
                <X className="h-3 w-3" />
                Reserved
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description || 'No description available'}
        </p>
        {isAvailable && onReserve && (
          <Button onClick={onReserve} className="w-full">
            Reserve Book
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
