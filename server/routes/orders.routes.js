import { Router } from 'express';
import { nanoid } from 'nanoid';
import { collections, clean, cleanAll } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { sendTelegramMessage, buildOrderTelegramMessage } from '../utils/telegram.js';

const router = Router();

const STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
const ORDER_TYPES = ['dine-in', 'pickup', 'delivery'];

// Public: a customer places an order from the menu / cart checkout.
router.post('/', async (req, res) => {
  const { slug, customerName, phone, type, notes, items } = req.body || {};
  if (!slug || !customerName || !phone || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Restaurant, customer name, phone and at least one item are required.' });
  }
  if (type && !ORDER_TYPES.includes(type)) {
    return res.status(400).json({ error: 'Invalid order type.' });
  }

  const restaurant = await collections.restaurants.findOne({ slug });
  if (!restaurant) return res.status(404).json({ error: 'Restaurant not found.' });

  const total = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0);
  const orderCount = await collections.orders.countDocuments();
  const order = {
    id: nanoid(),
    orderNumber: `#${String(orderCount + 1001)}`,
    restaurantId: restaurant.id,
    customerName,
    phone,
    type: type || 'pickup',
    notes: notes || '',
    items: items.map((i) => ({ itemId: i.itemId, name: i.name, price: Number(i.price), quantity: Number(i.quantity) })),
    total,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  await collections.orders.insertOne(order);
  res.status(201).json(clean(order));

  // Fire-and-forget: don't let a Telegram hiccup affect the order response.
  // telegramChatId may hold several comma-separated recipients.
  if (restaurant.telegramBotToken && restaurant.telegramChatId) {
    const message = buildOrderTelegramMessage(order, restaurant.name);
    restaurant.telegramChatId
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)
      .forEach((chatId) => sendTelegramMessage(restaurant.telegramBotToken, chatId, message));
  }
});

router.use(requireAuth);

router.get('/', async (req, res) => {
  const orders = await collections.orders
    .find({ restaurantId: req.admin.restaurantId })
    .sort({ createdAt: -1 })
    .toArray();
  res.json(cleanAll(orders));
});

router.put('/:id/status', async (req, res) => {
  const { status } = req.body || {};
  if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status.' });

  const order = await collections.orders.findOne({ id: req.params.id, restaurantId: req.admin.restaurantId });
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  await collections.orders.updateOne({ id: order.id }, { $set: { status } });
  const updated = await collections.orders.findOne({ id: order.id });
  res.json(clean(updated));
});

export default router;
