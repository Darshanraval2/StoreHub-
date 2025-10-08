import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Shop from '../models/Shop.js';
import Product from '../models/Product.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

// Public: All shops with products (MUST come before /:id)
router.get('/with-products', async (req, res) => {
  try {
    const shops = await Shop.find({}).lean();
    const shopIds = shops.map(s => s._id);
    const products = await Product.find({ shop: { $in: shopIds } }).lean();
    const shopIdToProducts = products.reduce((acc, p) => {
      const key = p.shop.toString();
      acc[key] = acc[key] || [];
      acc[key].push(p);
      return acc;
    }, {});
    const result = shops.map(s => ({ ...s, products: shopIdToProducts[s._id.toString()] || [] }));
    res.json(result);
  } catch (error) {
    console.error('Error fetching shops with products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Public: List a shop by id with products
router.get('/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).lean();
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    const products = await Product.find({ shop: shop._id }).lean();
    res.json({ ...shop, products });
  } catch (error) {
    console.error('Error fetching shop:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Protected: List current user's shops
router.get('/', authRequired, async (req, res) => {
  try {
    const shops = await Shop.find({ owner: req.user.id }).lean();
    const shopIds = shops.map(s => s._id);
    const products = await Product.find({ shop: { $in: shopIds } }).lean();
    const shopIdToProducts = products.reduce((acc, p) => {
      const key = p.shop.toString();
      acc[key] = acc[key] || [];
      acc[key].push(p);
      return acc;
    }, {});
    const result = shops.map(s => ({ ...s, products: shopIdToProducts[s._id.toString()] || [] }));
    res.json(result);
  } catch (error) {
    console.error('Error fetching user shops:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Protected: Create shop
router.post(
  '/',
  authRequired,
  [body('name').trim().notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid input', errors: errors.array() });
    }
    const { name, description = '', location = '' } = req.body;
    const shop = await Shop.create({ name, description, location, owner: req.user.id });
    res.status(201).json(shop);
  }
);

// Protected: Update shop
router.put('/:id', authRequired, async (req, res) => {
  const shop = await Shop.findById(req.params.id);
  if (!shop) return res.status(404).json({ message: 'Shop not found' });
  if (shop.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  shop.name = req.body.name ?? shop.name;
  shop.description = req.body.description ?? shop.description;
  shop.location = req.body.location ?? shop.location;
  await shop.save();
  res.json(shop);
});

// Protected: Delete shop and its products
router.delete('/:id', authRequired, async (req, res) => {
  const shop = await Shop.findById(req.params.id);
  if (!shop) return res.status(404).json({ message: 'Shop not found' });
  if (shop.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  await Product.deleteMany({ shop: shop._id });
  await shop.deleteOne();
  res.json({ message: 'Deleted' });
});

export default router;


