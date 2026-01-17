import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { getCatalogEntries, getCatalogEntryById } from "./server/db";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: 'catalog-db',
      configureServer(server) {
        server.middlewares.use('/api/catalogentries', async (_req, res) => {
          try {
            const entries = await getCatalogEntries();
            const data = entries.map((row) => ({
              itemId: row.item_id,
              title: row.title,
            }));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ data }));
          } catch (error) {
            console.error('Database error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Database error' }));
          }
        });

        server.middlewares.use('/api/catalogentrydetails', async (req, res, next) => {
          const url = req.url || '';
          const match = url.match(/^\/([^/]+)/);
          if (!match) {
            next();
            return;
          }
          const itemId = match[1];
          try {
            const entry = await getCatalogEntryById(itemId);
            if (!entry) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Entry not found' }));
              return;
            }
            const data = {
              itemId: entry.item_id,
              title: entry.title,
              author: entry.author || '',
              description: entry.description || '',
            };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ data }));
          } catch (error) {
            console.error('Database error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Database error' }));
          }
        });
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
