import bcrypt from 'bcryptjs';
import pool from '../../lib/db';
import { rateLimit } from './rateLimit';
// Apply rate limiting
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  maxRequests: 5, // Max requests per interval
});

export default async function handler(req, res) {
  // try {
  //   await limiter.check(res, 5, 'CACHE_TOKEN'); // 5 requests per minute
  // } catch {
  //   return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  // }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email is already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    const newUser = result.rows[0];
    return res.status(201).json({ user: newUser });
  } catch (error) {
    console.error('Error during user registration:', error);

    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email is already in use' });
    }

    return res.status(500).json({ error: 'User registration failed. Please try again later.' });
  }
}