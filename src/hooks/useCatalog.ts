import { useState, useEffect, useCallback } from 'react';
import { catalogApi, CatalogEntry } from '@/lib/api';

// Hook to fetch all catalog entries
export function useCatalogEntries() {
  const [data, setData] = useState<CatalogEntry[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await catalogApi.getEntries();
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch entries'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

// Hook to fetch a single catalog entry details
export function useCatalogEntry(id: string | undefined) {
  const [data, setData] = useState<CatalogEntry | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await catalogApi.getEntryDetails(id);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch entry'));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      refetch();
    } else {
      setIsLoading(false);
    }
  }, [id, refetch]);

  return { data, isLoading, error, refetch };
}

// Direct API call functions
export function useCatalogActions() {
  const createEntry = async (data: { title: string; author: string; description: string }) => {
    const itemId = crypto.randomUUID();
    await catalogApi.createEntry(itemId, {
      itemId,
      title: data.title,
      author: data.author,
      description: data.description,
    });
    return { itemId, ...data };
  };

  const updateEntry = async (itemId: string, data: { title: string; author: string; description: string }) => {
    await catalogApi.updateEntry(itemId, {
      itemId,
      title: data.title,
      author: data.author,
      description: data.description,
    });
  };

  const archiveEntry = async (itemId: string) => {
    await catalogApi.archiveEntry(itemId, { itemId });
  };

  const publishEntry = async (itemId: string) => {
    await catalogApi.publishItem(itemId, { itemId });
  };

  return {
    createEntry,
    updateEntry,
    archiveEntry,
    publishEntry,
  };
}
