import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { CatalogForm } from '@/components/catalog/CatalogForm';
import { useCatalogEntry, useCatalogActions } from '@/hooks/useCatalog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const EditEntry = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: entry, isLoading } = useCatalogEntry(id);
  const { updateEntry } = useCatalogActions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!entry) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-xl font-semibold mb-2">Entry not found</h2>
          <p className="text-muted-foreground mb-4">
            The catalog entry you're trying to edit doesn't exist
          </p>
          <Link to="/">
            <Button>Back to Catalog</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleSubmit = async (data: { title: string; author: string; description: string }) => {
    setIsSubmitting(true);
    try {
      await updateEntry(entry.itemId, data);
      toast.success('Entry updated successfully');
      navigate(`/entry/${entry.itemId}`);
    } catch (error) {
      toast.error('Failed to update entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          variant="ghost"
          className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Edit Entry</CardTitle>
            <CardDescription>
              Update the details of "{entry.title}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CatalogForm
              entry={{
                itemId: entry.itemId,
                title: entry.title,
                author: entry.author,
                description: entry.description,
                status: 'draft',
                createdDate: entry.createdDate,
              }}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditEntry;
