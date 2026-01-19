import {Layout} from '@/components/layout/Layout';
import {CatalogList} from '@/components/catalog/CatalogList';
import {useCatalogEntries} from '@/hooks/useCatalog';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {FileText, CheckCircle} from 'lucide-react';
import {useNotificationAll} from "@/hooks/useNotification.tsx";
import {CatalogEntry} from '@/types/catalog';

const Publishing = () => {
    const {data: entriesData, isLoading, refetch} = useCatalogEntries();

    // Refetch on notification
    useNotificationAll(() => {
        alert("CALLED")
        refetch();
    });

    // Transform API data to CatalogEntry format
    const entries: CatalogEntry[] = (entriesData || []).map(item => ({
        itemId: item.itemId,
        title: item.title,
        author: '',
        isbn: item.isbn || '',
        description: '',
        status: 'draft' as const,
        createdDate: ''
    }));

    // Since API doesn't return status, we'll show all as draft for now
    const draftEntries = entries;
    const publishedEntries: CatalogEntry[] = [];

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
                            <FileText className="h-4 w-4"/>
                            Pending Review
                            <span className="ml-1 text-xs text-muted-foreground">
                ({draftEntries.length})
              </span>
                        </TabsTrigger>
                        <TabsTrigger value="published" className="gap-2 px-4">
                            <CheckCircle className="h-4 w-4"/>
                            Published
                            <span className="ml-1 text-xs text-muted-foreground">
                ({publishedEntries.length})
              </span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="mt-6">
                        {isLoading ? (
                            <div className="text-center py-8 text-muted-foreground">Loading...</div>
                        ) : (
                            <CatalogList
                                entries={draftEntries}
                                emptyMessage="No entries pending review"
                            />
                        )}
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
