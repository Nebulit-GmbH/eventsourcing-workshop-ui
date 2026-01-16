export interface CatalogEntry {
  itemId: string;
  title: string;
  author: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface CatalogEvent {
  type: 'CREATED' | 'UPDATED' | 'ARCHIVED' | 'PUBLISHED';
  itemId: string;
  timestamp: Date;
  data: Partial<CatalogEntry>;
}

export type CreateCatalogEntryCommand = {
  title: string;
  author: string;
  description: string;
};

export type UpdateCatalogEntryCommand = {
  itemId: string;
  title: string;
  author: string;
  description: string;
};

export type ArchiveCatalogEntryCommand = {
  itemId: string;
};

export type PublishItemCommand = {
  itemId: string;
};
