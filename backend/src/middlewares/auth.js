import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

export const vendorMiddleware = (req, res, next) => {
  if (req.user?.role !== 'vendor') {
    return res.status(403).json({ message: 'Only vendors can access this route' });
  }
  next();
};

export const patientMiddleware = (req, res, next) => {
  if (req.user?.role !== 'patient') {
    return res.status(403).json({ message: 'Only patients can access this route' });
  }
  next();
};

export const doctorMiddleware = (req, res, next) => {
  if (req.user?.role !== 'doctor') {
    return res.status(403).json({ message: 'Only doctors can access this route' });
  }
  next();
};
