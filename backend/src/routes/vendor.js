import express from 'express';
import Inventory from '../models/Inventory.js';
import User from '../models/User.js';
import { authMiddleware, vendorMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Add or update inventory (requires vendor role)
router.post('/inventory', authMiddleware, vendorMiddleware, async (req, res) => {
  try {
    const { medicineId, price, stock } = req.body;
    const vendorId = req.user.id;

    if (!medicineId || !price || stock === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Get vendor details
    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== 'vendor') {
      return res.status(403).json({ message: 'Only vendors can add inventory' });
    }

    // Check if inventory exists, update or create
    let inventory = await Inventory.findOne({ medicineId, vendorId });

    if (inventory) {
      inventory.price = price;
      inventory.stock = stock;
      await inventory.save();
      return res.json({ message: 'Inventory updated', inventory });
    }

    // Create new inventory
    inventory = new Inventory({
      vendorId,
      medicineId,
      price,
      stock,
      storeName: vendor.storeName,
      address: vendor.address,
      isVerified: vendor.isVerified,
    });

    await inventory.save();
    res.status(201).json({ message: 'Inventory added', inventory });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Inventory for this medicine already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Get vendor's inventory
router.get('/inventory', authMiddleware, vendorMiddleware, async (req, res) => {
  try {
    const vendorId = req.user.id;
    const inventories = await Inventory.find({ vendorId })
      .populate('medicineId', 'name composition');
    res.json(inventories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
