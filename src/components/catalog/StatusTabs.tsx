import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, CheckCircle, Archive } from 'lucide-react';

interface StatusTabsProps {
  value: string;
  onChange: (value: string) => void;
  counts: {
    all: number;
    draft: number;
    published: number;
    archived: number;
  };
}

export function StatusTabs({ value, onChange, counts }: StatusTabsProps) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList className="h-10 p-1 bg-muted/50">
        <TabsTrigger value="all" className="gap-2 px-4">
          <FileText className="h-4 w-4" />
          All
          <span className="ml-1 text-xs text-muted-foreground">({counts.all})</span>
        </TabsTrigger>
        <TabsTrigger value="draft" className="gap-2 px-4">
          Draft
          <span className="ml-1 text-xs text-muted-foreground">({counts.draft})</span>
        </TabsTrigger>
        <TabsTrigger value="published" className="gap-2 px-4">
          <CheckCircle className="h-4 w-4" />
          Published
          <span className="ml-1 text-xs text-muted-foreground">({counts.published})</span>
        </TabsTrigger>
        <TabsTrigger value="archived" className="gap-2 px-4">
          <Archive className="h-4 w-4" />
          Archived
          <span className="ml-1 text-xs text-muted-foreground">({counts.archived})</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
