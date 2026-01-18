import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { CatalogList } from '@/components/catalog/CatalogList';
import { StatusTabs } from '@/components/catalog/StatusTabs';
import { useCatalogEntries } from '@/hooks/useCatalog';
import { useNotificationAll } from "@/hooks/useNotification.tsx";
import { CatalogEntry } from '@/types/catalog';

const Index = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: entriesData, isLoading, refetch } = useCatalogEntries();

  // Refetch on notification
  useNotificationAll(() => {
    refetch();
  });

  // Transform API data to CatalogEntry format
  const entries: CatalogEntry[] = (entriesData || []).map(item => ({
    itemId: item.itemId,
    title: item.title,
    author: '',
    description: '',
    status: 'draft' as const,
    createdDate: item.createdDate,
  }));

  const filteredEntries = entries.filter((entry) => {
    if (statusFilter === 'all') return true;
    return entry.status === statusFilter;
  });

  const counts = {
    all: entries.length,
    draft: entries.filter((e) => e.status === 'draft').length,
    published: entries.filter((e) => e.status === 'published').length,
    archived: entries.filter((e) => e.status === 'archived').length,
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Catalog Entries
          </h1>
          <p className="text-muted-foreground">
            Manage your catalog entries, publish content, and track status
          </p>
        </div>

        <StatusTabs value={statusFilter} onChange={setStatusFilter} counts={counts} />

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : (
          <CatalogList
            entries={filteredEntries}
            emptyMessage={
              statusFilter === 'all'
                ? 'No catalog entries yet'
                : `No ${statusFilter} entries`
            }
          />
        )}
      </div>
    </Layout>
  );
};

export default Index;
