import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { seedIfEmpty } from './utils/seed.js';
import { collections } from './db.js';
import authRoutes from './routes/auth.routes.js';
import restaurantRoutes from './routes/restaurants.routes.js';
import categoryRoutes from './routes/categories.routes.js';
import itemRoutes from './routes/items.routes.js';
import orderRoutes from './routes/orders.routes.js';
import uploadRoutes from './routes/upload.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await seedIfEmpty();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5195' }));
app.use(express.json({ limit: '2mb' }));
// Seed photos shipped with the app are served straight from disk; anything
// not found there (admin-uploaded images) falls through to MongoDB.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/uploads/:id', async (req, res) => {
  const file = await collections.uploads.findOne({ id: req.params.id });
  if (!file) return res.status(404).end();
  res.set('Content-Type', file.contentType);
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.send(file.data.buffer ? Buffer.from(file.data.buffer) : file.data);
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/admin/categories', categoryRoutes);
app.use('/api/admin/items', itemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// In production, serve the built client and let React Router handle
// client-side routes (anything not matched above and not under /api or
// /uploads falls back to index.html).
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use((req, res) => res.status(404).json({ error: 'Not found.' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
  console.log(`Digital Menu API running on http://localhost:${PORT}`);
});
