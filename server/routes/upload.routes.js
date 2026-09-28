import { Router } from 'express';
import multer from 'multer';
import { nanoid } from 'nanoid';
import { collections } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.has(file.mimetype)) return cb(new Error('Only image files are allowed.'));
    cb(null, true);
  },
});

const router = Router();

// Uploaded images are stored as binary documents in MongoDB (no third-party
// image host — avoids geo-restrictions and keeps everything on Atlas, which
// is already confirmed reachable). Served back at GET /uploads/:id, wired up
// in index.js alongside the static seed-photo folder.
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image file received.' });

  const id = nanoid();
  await collections.uploads.insertOne({
    id,
    contentType: req.file.mimetype,
    data: req.file.buffer,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json({ url: `/uploads/${id}` });
});

router.use((err, req, res, next) => {
  if (err) return res.status(400).json({ error: err.message || 'Upload failed.' });
  next();
});

export default router;
