import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user info to the request
    next(); // Call the next middleware or handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
