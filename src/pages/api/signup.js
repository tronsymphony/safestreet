import bcrypt from 'bcryptjs';
import pool from '../../lib/db';

export default async function handler(req, res) {
  // Ensure only POST requests are allowed
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if the email is already registered
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email is already in use' }); // 409 Conflict
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    // Return the newly created user (excluding sensitive data like password)
    const newUser = result.rows[0];
    return res.status(201).json({ user: newUser });
  } catch (error) {
    console.error('Error during user registration:', error);

    // Handle specific database errors
    if (error.code === '23505') {
      // Unique constraint violation (e.g., duplicate email)
      return res.status(409).json({ error: 'Email is already in use' });
    }

    // Generic server error
    return res.status(500).json({ error: 'User registration failed. Please try again later.' });
  }
}