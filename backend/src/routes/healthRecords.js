import express from 'express';
import HealthRecord from '../models/HealthRecord.js';
import { authMiddleware, patientMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Get health records for current patient
router.get('/', authMiddleware, patientMiddleware, async (req, res) => {
  try {
    const records = await HealthRecord.find({ patientId: req.user.id }).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new health record
router.post('/', authMiddleware, patientMiddleware, async (req, res) => {
  try {
    const { type, title, doctorName, date, status, details, fileUrl } = req.body;
    const record = new HealthRecord({
      patientId: req.user.id,
      type,
      title,
      doctorName,
      date,
      status,
      details,
      fileUrl
    });
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
