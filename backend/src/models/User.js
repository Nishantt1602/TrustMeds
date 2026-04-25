import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['patient', 'vendor', 'doctor'],
      default: 'patient',
    },
    storeName: {
      type: String,
      default: null,
    },
    // Doctor Specific Fields
    specialization: {
      type: String,
      default: null,
    },
    experienceYears: {
      type: Number,
      default: null,
      min: [0, 'Experience cannot be negative'],
    },
    fees: {
      type: Number,
      default: null,
      min: [0, 'Fees cannot be negative'],
    },
    qualifications: {
      type: String,
      default: null,
    },
    clinicAddress: {
      type: String,
      default: null,
    },
    availableSlots: [
      {
        day: { type: String, required: true }, // e.g., 'Monday'
        slots: [
          {
            startTime: { type: String, required: true }, // e.g., '09:00'
            endTime: { type: String, required: true }, // e.g., '10:00'
            isBooked: { type: Boolean, default: false },
          },
        ],
      },
    ],
    isOnDuty: {
      type: Boolean,
      default: true,
    },
    homeVisitFees: {
      type: Number,
      default: 0,
      min: [0, 'Home visit fees cannot be negative'],
    },
    homeVisitEnabled: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    medicationReminders: [
      {
        pillName: { type: String, required: true },
        time: { type: String, required: true }, // HH:mm
        frequency: { type: String, default: 'Daily' },
        isActive: { type: Boolean, default: true }
      }
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
