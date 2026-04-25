import express from 'express';
import User from '../models/User.js';
import { authMiddleware, doctorMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Get doctor profile
router.get('/profile', authMiddleware, doctorMiddleware, async (req, res) => {
  try {
    const doctor = await User.findById(req.user.id).select('-password');
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update doctor professional details
router.put('/update-details', authMiddleware, doctorMiddleware, async (req, res) => {
  try {
    const { 
      specialization, 
      experienceYears, 
      fees, 
      qualifications, 
      clinicAddress,
      isOnDuty,
      homeVisitFees,
      homeVisitEnabled
    } = req.body;
    
    const doctor = await User.findByIdAndUpdate(
      req.user.id,
      { 
        specialization, 
        experienceYears, 
        fees, 
        qualifications, 
        clinicAddress,
        isOnDuty,
        homeVisitFees,
        homeVisitEnabled
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update available slots
router.put('/slots', authMiddleware, doctorMiddleware, async (req, res) => {
  try {
    const { availableSlots } = req.body;
    
    const doctor = await User.findByIdAndUpdate(
      req.user.id,
      { availableSlots },
      { new: true }
    ).select('-password');

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
