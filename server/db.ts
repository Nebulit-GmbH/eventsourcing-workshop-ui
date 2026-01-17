import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
});

export interface CatalogEntryRow {
  item_id: string;
  title: string;
  author?: string;
  description?: string;
}

export async function getCatalogEntries(): Promise<CatalogEntryRow[]> {
  const result = await pool.query<CatalogEntryRow>(
    'SELECT item_id, title FROM catalog_entries_read_model_entity'
  );
  return result.rows;
}

export async function getCatalogEntryById(itemId: string): Promise<CatalogEntryRow | null> {
  const result = await pool.query<CatalogEntryRow>(
    'SELECT item_id, title FROM catalog_entries_read_model_entity WHERE item_id = $1',
    [itemId]
  );
  return result.rows[0] || null;
}

export default pool;