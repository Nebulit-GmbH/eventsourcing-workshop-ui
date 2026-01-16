import { CatalogEntry } from '@/types/catalog';
import { CatalogCard } from './CatalogCard';
import { FileText } from 'lucide-react';

interface CatalogListProps {
  entries: CatalogEntry[];
  emptyMessage?: string;
}

export function CatalogList({ entries, emptyMessage = "No entries yet" }: CatalogListProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">{emptyMessage}</h3>
        <p className="text-sm text-muted-foreground">
          Create your first catalog entry to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry, index) => (
        <div
          key={entry.itemId}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <CatalogCard entry={entry} />
        </div>
      ))}
    </div>
  );
}
