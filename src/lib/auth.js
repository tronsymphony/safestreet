// lib/auth.js
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET;

export function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Access denied, token missing!' });
  } else {
    try {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(400).json({ error: 'Invalid token!' });
    }
  }
}
