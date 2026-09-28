import { Router } from 'express';
import { collections, clean } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// NOTE: admin/static routes must be registered before the "/:slug" catch-all
// below, otherwise Express would match "/admin/me" as slug === "admin".

router.get('/admin/me', requireAuth, async (req, res) => {
  const restaurant = await collections.restaurants.findOne({ id: req.admin.restaurantId });
  if (!restaurant) return res.status(404).json({ error: 'Restaurant not found.' });
  res.json(clean(restaurant));
});

const SETTINGS_FIELDS = [
  'name', 'description', 'logo', 'cover',
  'phone', 'whatsapp', 'address', 'social', 'googleMapsUrl', 'slug',
  'telegramBotToken', 'telegramChatId',
];

router.put('/admin/me', requireAuth, async (req, res) => {
  const restaurant = await collections.restaurants.findOne({ id: req.admin.restaurantId });
  if (!restaurant) return res.status(404).json({ error: 'Restaurant not found.' });

  if (req.body.slug && req.body.slug !== restaurant.slug) {
    const taken = await collections.restaurants.findOne({ slug: req.body.slug, id: { $ne: restaurant.id } });
    if (taken) return res.status(400).json({ error: 'This menu link is already taken.' });
  }

  const update = {};
  SETTINGS_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) update[field] = req.body[field];
  });

  await collections.restaurants.updateOne({ id: restaurant.id }, { $set: update });
  const updated = await collections.restaurants.findOne({ id: restaurant.id });
  res.json(clean(updated));
});

router.put('/admin/theme', requireAuth, async (req, res) => {
  const restaurant = await collections.restaurants.findOne({ id: req.admin.restaurantId });
  if (!restaurant) return res.status(404).json({ error: 'Restaurant not found.' });

  const theme = { ...restaurant.theme, ...req.body };
  await collections.restaurants.updateOne({ id: restaurant.id }, { $set: { theme } });
  const updated = await collections.restaurants.findOne({ id: restaurant.id });
  res.json(clean(updated));
});

router.get('/admin/dashboard', requireAuth, async (req, res) => {
  const { restaurantId } = req.admin;
  const [categories, items, orders, restaurant] = await Promise.all([
    collections.categories.find({ restaurantId }).toArray(),
    collections.items.find({ restaurantId }).toArray(),
    collections.orders.find({ restaurantId }).toArray(),
    collections.restaurants.findOne({ id: restaurantId }),
  ]);

  res.json({
    totalCategories: categories.length,
    totalItems: items.length,
    availableItems: items.filter((i) => i.available).length,
    hiddenItems: items.filter((i) => !i.available).length,
    featuredItems: items.filter((i) => i.featured).length,
    totalViews: restaurant?.views || 0,
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
    recentOrders: [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5).map(clean),
    ordersByStatus: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map((status) => ({
      status,
      count: orders.filter((o) => o.status === status).length,
    })),
  });
});

function publicMenuPayload(restaurant, categories, items) {
  return {
    restaurant: clean(restaurant),
    categories: categories.filter((c) => c.active).sort((a, b) => a.sortOrder - b.sortOrder).map(clean),
    items: items.sort((a, b) => a.sortOrder - b.sortOrder).map(clean),
  };
}

// Public: full menu payload for the customer-facing page.
router.get('/:slug', async (req, res) => {
  const restaurant = await collections.restaurants.findOne({ slug: req.params.slug });
  if (!restaurant) return res.status(404).json({ error: 'Restaurant not found.' });

  const [categories, items] = await Promise.all([
    collections.categories.find({ restaurantId: restaurant.id }).toArray(),
    collections.items.find({ restaurantId: restaurant.id }).toArray(),
  ]);
  res.json(publicMenuPayload(restaurant, categories, items));
});

// Public: increment the page-view counter (fired once per customer page load).
router.post('/:slug/view', async (req, res) => {
  const { matchedCount } = await collections.restaurants.updateOne(
    { slug: req.params.slug },
    { $inc: { views: 1 } }
  );
  if (matchedCount === 0) return res.status(404).json({ error: 'Restaurant not found.' });
  const updated = await collections.restaurants.findOne({ slug: req.params.slug });
  res.json({ views: updated.views });
});

export default router;
