import express from 'express';
import Prescription from '../models/Prescription.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Issue a prescription (Doctor only)
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ message: 'Only doctors can issue prescriptions' });
  }

  try {
    const { patientId, diagnosis, medicines, notes } = req.body;
    const prescription = new Prescription({
      patientId,
      doctorId: req.user.id,
      doctorName: req.user.name,
      diagnosis,
      medicines,
      notes
    });

    await prescription.save();
    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Failed to issue prescription', error: error.message });
  }
});

// Get my prescriptions (Patient)
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.user.id }).sort({ issuedAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch prescriptions' });
  }
});

// Get prescriptions for a specific patient (Doctor)
router.get('/patient/:patientId', authMiddleware, async (req, res) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const prescriptions = await Prescription.find({ patientId: req.params.patientId }).sort({ issuedAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch' });
  }
});

export default router;
