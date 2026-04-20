import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedMedicinesData from './seedMedicines.js';

dotenv.config();

const connectAndSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');

    await seedMedicinesData();

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

connectAndSeed();
