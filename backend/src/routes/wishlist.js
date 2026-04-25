import express from 'express';
import Wishlist from '../models/Wishlist.js';
import Medicine from '../models/Medicine.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Add item to wishlist
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { medicineId, vendorId, vendorName, price, inventoryId } = req.body;
    const userId = req.user.id;

    if (!medicineId || !vendorId || !vendorName || price === undefined || !inventoryId) {
      return res.status(400).json({ message: 'Medicine, vendor, price and inventoryId are required' });
    }

    // Validate medicine exists
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Check if already in wishlist (Medicine + Vendor)
    const existingWishlist = await Wishlist.findOne({ userId, medicineId, vendorId });
    if (existingWishlist) {
      return res.status(400).json({ message: 'This offer is already in your wishlist' });
    }

    // Add to wishlist
    const wishlistItem = new Wishlist({
      userId,
      medicineId,
      vendorId,
      vendorName,
      price,
      inventoryId
    });

    await wishlistItem.save();

    res.status(201).json({
      message: 'Added to Wishlist successfully',
      wishlistItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's wishlist
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.find({ userId }).populate('medicineId');

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove item from wishlist
router.delete('/:medicineId', authMiddleware, async (req, res) => {
  try {
    const { medicineId } = req.params;
    const userId = req.user.id;

    const result = await Wishlist.findOneAndDelete({
      userId,
      medicineId,
    });

    if (!result) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    res.json({ message: 'Removed from Wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
