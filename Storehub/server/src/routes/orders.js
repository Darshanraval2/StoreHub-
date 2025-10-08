import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Shop from '../models/Shop.js';

const router = Router();

// Get orders for shop owner
router.get('/shop/:shopId', authRequired, async (req, res) => {
  const shop = await Shop.findById(req.params.shopId);
  if (!shop || shop.owner.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  const orders = await Order.find()
    .populate({
      path: 'product',
      populate: {
        path: 'shop',
        model: 'Shop'
      }
    })
    .populate('buyer', 'name email')
    .sort({ createdAt: -1 });
  
  const shopOrders = orders.filter(order => 
    order.product && order.product.shop && order.product.shop._id.toString() === req.params.shopId
  );
  
  res.json(shopOrders);
});

// Update order status
router.put('/:id/status', authRequired, async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id).populate('product');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  
  const shop = await Shop.findById(order.product.shop);
  if (shop.owner.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  order.status = status;
  await order.save();
  res.json(order);
});

export default router;