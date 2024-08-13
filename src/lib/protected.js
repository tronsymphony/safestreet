// pages/api/protected.js
import { verifyToken } from '../../lib/auth';

export default function handler(req, res) {
  verifyToken(req, res, () => {
    res.status(200).json({ message: 'This is a protected route', user: req.user });
  });
}
