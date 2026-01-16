import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CatalogEntry, CatalogEvent } from '@/types/catalog';

interface CatalogState {
  entries: CatalogEntry[];
  events: CatalogEvent[];
  
  // Commands
  createEntry: (data: { title: string; author: string; description: string }) => CatalogEntry;
  updateEntry: (itemId: string, data: { title: string; author: string; description: string }) => void;
  archiveEntry: (itemId: string) => void;
  publishEntry: (itemId: string) => void;
  
  // Queries
  getEntry: (itemId: string) => CatalogEntry | undefined;
  getPublishedEntries: () => CatalogEntry[];
  getDraftEntries: () => CatalogEntry[];
  getArchivedEntries: () => CatalogEntry[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set, get) => ({
      entries: [],
      events: [],

      createEntry: (data) => {
        const newEntry: CatalogEntry = {
          itemId: generateId(),
          title: data.title,
          author: data.author,
          description: data.description,
          status: 'draft',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const event: CatalogEvent = {
          type: 'CREATED',
          itemId: newEntry.itemId,
          timestamp: new Date(),
          data: newEntry,
        };

        set((state) => ({
          entries: [...state.entries, newEntry],
          events: [...state.events, event],
        }));

        return newEntry;
      },

      updateEntry: (itemId, data) => {
        const event: CatalogEvent = {
          type: 'UPDATED',
          itemId,
          timestamp: new Date(),
          data,
        };

        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.itemId === itemId
              ? { ...entry, ...data, updatedAt: new Date() }
              : entry
          ),
          events: [...state.events, event],
        }));
      },

      archiveEntry: (itemId) => {
        const event: CatalogEvent = {
          type: 'ARCHIVED',
          itemId,
          timestamp: new Date(),
          data: { status: 'archived' },
        };

        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.itemId === itemId
              ? { ...entry, status: 'archived', updatedAt: new Date() }
              : entry
          ),
          events: [...state.events, event],
        }));
      },

      publishEntry: (itemId) => {
        const event: CatalogEvent = {
          type: 'PUBLISHED',
          itemId,
          timestamp: new Date(),
          data: { status: 'published' },
        };

        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.itemId === itemId
              ? { ...entry, status: 'published', updatedAt: new Date() }
              : entry
          ),
          events: [...state.events, event],
        }));
      },

      getEntry: (itemId) => {
        return get().entries.find((entry) => entry.itemId === itemId);
      },

      getPublishedEntries: () => {
        return get().entries.filter((entry) => entry.status === 'published');
      },

      getDraftEntries: () => {
        return get().entries.filter((entry) => entry.status === 'draft');
      },

      getArchivedEntries: () => {
        return get().entries.filter((entry) => entry.status === 'archived');
      },
    }),
    {
      name: 'catalog-storage',
    }
  )
);
