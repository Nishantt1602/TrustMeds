export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate field value entered' });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: messages });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};
