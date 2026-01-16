import { Layout } from '@/components/layout/Layout';
import { CatalogList } from '@/components/catalog/CatalogList';
import { useCatalogStore } from '@/store/catalogStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, CheckCircle } from 'lucide-react';

const Publishing = () => {
  const getDraftEntries = useCatalogStore((state) => state.getDraftEntries);
  const getPublishedEntries = useCatalogStore((state) => state.getPublishedEntries);

  const draftEntries = getDraftEntries();
  const publishedEntries = getPublishedEntries();

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Publishing Queue
          </h1>
          <p className="text-muted-foreground">
            Review draft entries ready for publication and manage published content
          </p>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="h-10 p-1 bg-muted/50">
            <TabsTrigger value="pending" className="gap-2 px-4">
              <FileText className="h-4 w-4" />
              Pending Review
              <span className="ml-1 text-xs text-muted-foreground">
                ({draftEntries.length})
              </span>
            </TabsTrigger>
            <TabsTrigger value="published" className="gap-2 px-4">
              <CheckCircle className="h-4 w-4" />
              Published
              <span className="ml-1 text-xs text-muted-foreground">
                ({publishedEntries.length})
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <CatalogList
              entries={draftEntries}
              emptyMessage="No entries pending review"
            />
          </TabsContent>

          <TabsContent value="published" className="mt-6">
            <CatalogList
              entries={publishedEntries}
              emptyMessage="No published entries yet"
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Publishing;
