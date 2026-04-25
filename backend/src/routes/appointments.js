import express from 'express';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { authMiddleware, patientMiddleware, doctorMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Book an appointment (Patient only)
router.post('/book', authMiddleware, patientMiddleware, async (req, res) => {
  try {
    const { doctorId, day, startTime, endTime, reason, bookingType, totalFee } = req.body;
    const patientId = req.user.id;

    // Check if slot is still available in Doctor's profile
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const dayObj = doctor.availableSlots.find(s => s.day === day);
    if (!dayObj) {
      return res.status(400).json({ message: 'Day not available for this doctor' });
    }

    const slot = dayObj.slots.find(s => s.startTime === startTime && s.endTime === endTime);
    if (!slot || slot.isBooked) {
      return res.status(400).json({ message: 'Slot not available or already booked' });
    }

    // Create appointment
    const appointment = new Appointment({
      patientId,
      doctorId,
      day,
      startTime,
      endTime,
      reason,
      bookingType: bookingType || 'Clinic Visit',
      totalFee: totalFee || 0,
      status: 'confirmed' // Auto-confirming for now, could be 'pending'
    });

    await appointment.save();

    // Mark slot as booked in doctor document
    slot.isBooked = true;
    doctor.markModified('availableSlots');
    await doctor.save();

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get appointments for current user (Patient or Doctor)
router.get('/my-appointments', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const filter = req.user.role === 'doctor' ? { doctorId: userId } : { patientId: userId };
    
    const appointments = await Appointment.find(filter)
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name specialization qualifications clinicAddress')
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel appointment
router.put('/cancel/:id', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Only patient or doctor involved can cancel
    if (appointment.patientId.toString() !== req.user.id && appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    // Re-open the slot
    const doctor = await User.findById(appointment.doctorId);
    if (doctor) {
      const dayObj = doctor.availableSlots.find(s => s.day === appointment.day);
      if (dayObj) {
        const slot = dayObj.slots.find(s => s.startTime === appointment.startTime && s.endTime === appointment.endTime);
        if (slot) {
          slot.isBooked = false;
          doctor.markModified('availableSlots');
          await doctor.save();
        }
      }
    }

    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
