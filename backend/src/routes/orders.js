import express from 'express';
import Order from '../models/Order.js';
import Inventory from '../models/Inventory.js';
import { authMiddleware, vendorMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Create new order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { vendorId, vendorName, items, totalAmount } = req.body;

    if (!vendorId || !items || !items.length) {
      return res.status(400).json({ message: 'Invalid order structure or missing vendor ID' });
    }

    const order = new Order({
      patientId: req.user.id,
      vendorId,
      vendorName,
      items,
      totalAmount
    });

    await order.save();

    // Dynamically deduct inventory stock where an inventoryId maps accurately
    for (let item of items) {
      if(item.inventoryId) {
        await Inventory.findByIdAndUpdate(item.inventoryId, { $inc: { stock: -item.quantity } });
      }
    }

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch historical orders for a logged-in patient
router.get('/patient', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ patientId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch active order requests for a vendor
router.get('/vendor', authMiddleware, vendorMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ vendorId: req.user.id })
      .populate('patientId', 'name address phone email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Vendor updating order status
router.put('/:id/status', authMiddleware, vendorMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.user.id },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
