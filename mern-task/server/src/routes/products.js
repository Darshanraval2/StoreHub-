import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authRequired } from '../middleware/auth.js';
import Shop from '../models/Shop.js';
import Product from '../models/Product.js';

const router = Router();

// Protected: Create product
router.post(
  '/',
  authRequired,
  [body('name').trim().notEmpty(), body('price').isFloat({ min: 0 }), body('shopId').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid input', errors: errors.array() });
    }
    const { name, description = '', price, stock = 0, photo = '', shopId } = req.body;
    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    if (shop.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    const product = await Product.create({ name, description, price, stock, photo, shop: shop._id });
    res.status(201).json(product);
  }
);

// Protected: Update product
router.put('/:id', authRequired, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const shop = await Shop.findById(product.shop);
  if (!shop) return res.status(404).json({ message: 'Shop not found' });
  if (shop.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  product.name = req.body.name ?? product.name;
  product.description = req.body.description ?? product.description;
  if (req.body.price !== undefined) product.price = req.body.price;
  if (req.body.stock !== undefined) product.stock = req.body.stock;
  if (req.body.photo !== undefined) product.photo = req.body.photo;
  await product.save();
  res.json(product);
});

// Protected: Delete product
router.delete('/:id', authRequired, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const shop = await Shop.findById(product.shop);
  if (!shop) return res.status(404).json({ message: 'Shop not found' });
  if (shop.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  await product.deleteOne();
  res.json({ message: 'Deleted' });
});

export default router;


