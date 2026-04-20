import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    composition: {
      type: String,
      required: true,
    },
    uses: {
      type: String,
      required: true,
    },
    sideEffects: {
      type: String,
      default: '',
    },
    dosage: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Medicine', medicineSchema);
