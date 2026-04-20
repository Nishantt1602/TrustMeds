import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Search for doctors
router.get('/doctors', async (req, res) => {
  try {
    const { q } = req.query;
    let query = { role: 'doctor' };
    
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { specialization: { $regex: q, $options: 'i' } }
      ];
    }

    const doctors = await User.find(query).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get doctor details by ID
router.get('/doctors/:id', async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' }).select('-password');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
