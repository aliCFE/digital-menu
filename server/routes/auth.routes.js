import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { collections } from '../db.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const admins = await collections.admins.find().toArray();
  const admin = admins.find((a) => a.username.toLowerCase() === String(username).toLowerCase());
  if (!admin || !bcrypt.compareSync(password, admin.passwordHash)) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const token = signToken(admin);
  res.json({
    token,
    admin: { id: admin.id, username: admin.username, name: admin.name, restaurantId: admin.restaurantId },
  });
});

router.get('/me', requireAuth, async (req, res) => {
  const admin = await collections.admins.findOne({ id: req.admin.id });
  if (!admin) return res.status(404).json({ error: 'Admin not found.' });
  res.json({ id: admin.id, username: admin.username, name: admin.name, restaurantId: admin.restaurantId });
});

router.put('/me', requireAuth, async (req, res) => {
  const { name, username, currentPassword, newPassword } = req.body || {};
  const admin = await collections.admins.findOne({ id: req.admin.id });
  if (!admin) return res.status(404).json({ error: 'Admin not found.' });

  const update = {};
  if (newPassword) {
    if (!currentPassword || !bcrypt.compareSync(currentPassword, admin.passwordHash)) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }
    update.passwordHash = bcrypt.hashSync(newPassword, 10);
  }
  if (name) update.name = name;
  if (username) update.username = username;

  await collections.admins.updateOne({ id: admin.id }, { $set: update });
  const updated = await collections.admins.findOne({ id: admin.id });
  res.json({ id: updated.id, username: updated.username, name: updated.name, restaurantId: updated.restaurantId });
});

export default router;
