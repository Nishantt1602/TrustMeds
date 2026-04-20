import express from 'express';
import User from '../models/User.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Update user profile
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const userId = req.user.id;

    // Update user
    const updateData = { name, address };
    if (phone) updateData.phone = phone;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      storeName: user.storeName,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
