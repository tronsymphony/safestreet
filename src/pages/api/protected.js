import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const token = req.cookies.token; 

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Proceed with the protected resource
    res.status(200).json({ message: 'Protected content', data: decoded });
  } catch (error) {
    console.error('Invalid token:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
}
