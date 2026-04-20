import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { patientMiddleware, vendorMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { 
      name, email, password, role = 'patient', 
      storeName, address, phone,
      specialization, experienceYears, fees, qualifications, clinicAddress 
    } = req.body;

    if (!name || !email || !password || !address) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      role,
      storeName: role === 'vendor' ? storeName : null,
      specialization: role === 'doctor' ? specialization : null,
      experienceYears: role === 'doctor' ? experienceYears : null,
      fees: role === 'doctor' ? fees : null,
      qualifications: role === 'doctor' ? qualifications : null,
      clinicAddress: role === 'doctor' ? clinicAddress : null,
      address,
      phone,
      isVerified: false,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      phone: user.phone,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function for role-specific login
const performLogin = async (email, password, expectedRole) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw { status: 401, message: 'Invalid email or password' };
  }

  if (user.role !== expectedRole) {
    throw { status: 403, message: `This email is registered as a ${user.role}, not a ${expectedRole}` };
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw { status: 401, message: 'Invalid email or password' };
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    storeName: user.storeName,
    address: user.address,
    phone: user.phone,
    token,
  };
};

// Patient Login
router.post('/login/patient', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const response = await performLogin(email, password, 'patient');
    res.json(response);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

// Vendor Login
router.post('/login/vendor', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const response = await performLogin(email, password, 'vendor');
    res.json(response);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

// Doctor Login
router.post('/login/doctor', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const response = await performLogin(email, password, 'doctor');
    res.json(response);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

// Generic Login (backwards compatibility)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      storeName: user.storeName,
      address: user.address,
      phone: user.phone,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
