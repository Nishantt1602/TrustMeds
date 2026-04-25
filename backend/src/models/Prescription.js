const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  },
  medicines: [{
    name: String,
    dosage: String, // e.g. "1-0-1"
    duration: String, // e.g. "5 days"
    instructions: String
  }],
  notes: {
    type: String
  },
  issuedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
