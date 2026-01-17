import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { CatalogForm } from '@/components/catalog/CatalogForm';
import { useCatalogStore } from '@/store/catalogStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CreateEntry = () => {
  const navigate = useNavigate();
  const createEntry = useCatalogStore((state) => state.createEntry);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: { title: string; author: string; description: string }) => {
    setIsSubmitting(true);
    try {
      const entry = createEntry(data);
      toast.success('Catalog entry created successfully');
      navigate(`/entry/${entry.itemId}`);
    } catch (error) {
      toast.error('Failed to create entry');
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
            <CardTitle className="font-serif text-2xl">Create Catalog Entry</CardTitle>
            <CardDescription>
              Add a new item to your catalog with title, author, and description
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CatalogForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateEntry;
