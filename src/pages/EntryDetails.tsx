import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCatalogStore } from '@/store/catalogStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Edit, Archive, Send, User, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const statusStyles = {
  draft: 'bg-muted text-muted-foreground',
  published: 'bg-success/10 text-success border-success/20',
  archived: 'bg-secondary text-secondary-foreground',
};

const EntryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getEntry = useCatalogStore((state) => state.getEntry);
  const archiveEntry = useCatalogStore((state) => state.archiveEntry);
  const publishEntry = useCatalogStore((state) => state.publishEntry);

  const entry = id ? getEntry(id) : undefined;

  if (!entry) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-xl font-semibold mb-2">Entry not found</h2>
          <p className="text-muted-foreground mb-4">
            The catalog entry you're looking for doesn't exist
          </p>
          <Link to="/">
            <Button>Back to Catalog</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handlePublish = () => {
    publishEntry(entry.itemId);
    toast.success('Entry published successfully');
  };

  const handleArchive = () => {
    archiveEntry(entry.itemId);
    toast.success('Entry archived');
    navigate('/');
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Button
          variant="ghost"
          className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="shadow-card border-border/50 overflow-hidden">
          <CardHeader className="pb-4 border-b border-border/50">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Badge className={cn('capitalize', statusStyles[entry.status])}>
                  {entry.status}
                </Badge>
                <h1 className="font-serif text-3xl font-bold text-foreground">
                  {entry.title}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {entry.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Created {format(new Date(entry.createdAt), 'MMM d, yyyy')}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Updated {format(new Date(entry.updatedAt), 'MMM d, yyyy \'at\' h:mm a')}
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="prose prose-slate max-w-none">
              <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
                Description
              </h3>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {entry.description}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-4">
          <Link to={`/entry/${entry.itemId}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Entry
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            {entry.status !== 'archived' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="gap-2 text-muted-foreground">
                    <Archive className="h-4 w-4" />
                    Archive
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Archive this entry?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will move the entry to the archive. You can still view it, but it won't appear in the main catalog.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleArchive}>
                      Archive Entry
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {entry.status === 'draft' && (
              <Button onClick={handlePublish} className="gap-2">
                <Send className="h-4 w-4" />
                Publish
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EntryDetails;
