import { Router } from 'express';
import { nanoid } from 'nanoid';
import { collections, clean, cleanAll } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const EDITABLE_FIELDS = [
  'name', 'description', 'price', 'oldPrice',
  'categoryId', 'image', 'available', 'featured', 'popular', 'isNew', 'discount', 'sortOrder',
];

router.get('/', async (req, res) => {
  const items = await collections.items
    .find({ restaurantId: req.admin.restaurantId })
    .sort({ sortOrder: 1 })
    .toArray();
  res.json(cleanAll(items));
});

router.post('/', async (req, res) => {
  const { name, categoryId, price } = req.body || {};
  if (!name || !categoryId || price === undefined) {
    return res.status(400).json({ error: 'Name, category and price are required.' });
  }

  const siblingCount = await collections.items.countDocuments({ restaurantId: req.admin.restaurantId });
  const item = {
    id: nanoid(),
    restaurantId: req.admin.restaurantId,
    name,
    description: req.body.description || '',
    price: Number(price) || 0,
    oldPrice: req.body.oldPrice ? Number(req.body.oldPrice) : null,
    categoryId,
    image: req.body.image || '',
    available: req.body.available === undefined ? true : !!req.body.available,
    featured: !!req.body.featured,
    popular: !!req.body.popular,
    isNew: !!req.body.isNew,
    discount: Number(req.body.discount) || 0,
    sortOrder: siblingCount,
    createdAt: new Date().toISOString(),
  };
  await collections.items.insertOne(item);
  res.status(201).json(clean(item));
});

router.put('/reorder', async (req, res) => {
  const { orderedIds } = req.body || {};
  if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'orderedIds must be an array.' });

  await Promise.all(
    orderedIds.map((id, index) =>
      collections.items.updateOne(
        { id, restaurantId: req.admin.restaurantId },
        { $set: { sortOrder: index } }
      )
    )
  );
  res.json({ ok: true });
});

router.post('/:id/duplicate', async (req, res) => {
  const original = await collections.items.findOne({ id: req.params.id, restaurantId: req.admin.restaurantId });
  if (!original) return res.status(404).json({ error: 'Item not found.' });

  const siblingCount = await collections.items.countDocuments({ restaurantId: req.admin.restaurantId });
  const { _id, ...rest } = original;
  const copy = {
    ...rest,
    id: nanoid(),
    name: `${original.name} (نسخة)`,
    sortOrder: siblingCount,
    createdAt: new Date().toISOString(),
  };
  await collections.items.insertOne(copy);
  res.status(201).json(clean(copy));
});

router.put('/:id', async (req, res) => {
  const item = await collections.items.findOne({ id: req.params.id, restaurantId: req.admin.restaurantId });
  if (!item) return res.status(404).json({ error: 'Item not found.' });

  const update = {};
  EDITABLE_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) update[field] = req.body[field];
  });

  await collections.items.updateOne({ id: item.id }, { $set: update });
  const updated = await collections.items.findOne({ id: item.id });
  res.json(clean(updated));
});

router.delete('/:id', async (req, res) => {
  const exists = await collections.items.findOne({ id: req.params.id, restaurantId: req.admin.restaurantId });
  if (!exists) return res.status(404).json({ error: 'Item not found.' });

  await collections.items.deleteOne({ id: req.params.id });
  res.json({ ok: true });
});

export default router;
