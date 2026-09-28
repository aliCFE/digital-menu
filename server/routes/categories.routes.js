import { Router } from 'express';
import { nanoid } from 'nanoid';
import { collections, clean, cleanAll } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const categories = await collections.categories
    .find({ restaurantId: req.admin.restaurantId })
    .sort({ sortOrder: 1 })
    .toArray();
  res.json(cleanAll(categories));
});

router.post('/', async (req, res) => {
  const { name, description, image, active } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Category name is required.' });

  const siblingCount = await collections.categories.countDocuments({ restaurantId: req.admin.restaurantId });
  const category = {
    id: nanoid(),
    restaurantId: req.admin.restaurantId,
    name,
    description: description || '',
    image: image || '',
    active: active === undefined ? true : !!active,
    sortOrder: siblingCount,
    createdAt: new Date().toISOString(),
  };
  await collections.categories.insertOne(category);
  res.status(201).json(clean(category));
});

router.put('/reorder', async (req, res) => {
  const { orderedIds } = req.body || {};
  if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'orderedIds must be an array.' });

  await Promise.all(
    orderedIds.map((id, index) =>
      collections.categories.updateOne(
        { id, restaurantId: req.admin.restaurantId },
        { $set: { sortOrder: index } }
      )
    )
  );
  res.json({ ok: true });
});

router.put('/:id', async (req, res) => {
  const category = await collections.categories.findOne({ id: req.params.id, restaurantId: req.admin.restaurantId });
  if (!category) return res.status(404).json({ error: 'Category not found.' });

  const editable = ['name', 'description', 'image', 'active', 'sortOrder'];
  const update = {};
  editable.forEach((field) => {
    if (req.body[field] !== undefined) update[field] = req.body[field];
  });

  await collections.categories.updateOne({ id: category.id }, { $set: update });
  const updated = await collections.categories.findOne({ id: category.id });
  res.json(clean(updated));
});

router.delete('/:id', async (req, res) => {
  const category = await collections.categories.findOne({ id: req.params.id, restaurantId: req.admin.restaurantId });
  if (!category) return res.status(404).json({ error: 'Category not found.' });

  const itemCount = await collections.items.countDocuments({ categoryId: category.id });
  if (itemCount > 0) {
    return res.status(400).json({ error: `Cannot delete: ${itemCount} item(s) still use this category.` });
  }

  await collections.categories.deleteOne({ id: category.id });
  res.json({ ok: true });
});

export default router;
