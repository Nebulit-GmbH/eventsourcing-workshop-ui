import { Link } from 'react-router-dom';
import { CatalogEntry } from '@/types/catalog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CatalogCardProps {
  entry: CatalogEntry;
}

const statusStyles = {
  draft: 'bg-muted text-muted-foreground',
  published: 'bg-success/10 text-success border-success/20',
  archived: 'bg-secondary text-secondary-foreground',
};

export function CatalogCard({ entry }: CatalogCardProps) {
  return (
    <Link to={`/entry/${entry.itemId}`}>
      <Card className="group shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                {entry.title}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {entry.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {entry.createdDate ? new Date(entry.createdDate).toLocaleDateString("en") : "-"}
                </span>
              </div>
            </div>
            <Badge className={cn('capitalize shrink-0', statusStyles[entry.status])}>
              {entry.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {entry.description}
          </p>
          <div className="mt-4 flex items-center text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
            View details
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
