import mongoose from 'mongoose';

const healthRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['Prescription', 'Lab Report', 'Vaccination', 'Surgery'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Completed', 'Archived'],
      default: 'Active',
    },
    details: {
      type: String,
    },
    fileUrl: {
      type: String, // Optional URL to a PDF or image
    },
  },
  { timestamps: true }
);

export default mongoose.model('HealthRecord', healthRecordSchema);
