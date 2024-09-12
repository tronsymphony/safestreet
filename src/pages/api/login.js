import bcrypt from 'bcryptjs';
import pool from '../../lib/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if the user exists
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // Check if the password is correct using bcrypt.compare
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET, // Ensure you have this set in your environment variables
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Set the JWT token in an HTTP-only cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600;${isProduction ? ' Secure;' : ''} SameSite=Strict`);

    // Return success response along with basic user information
    return res.status(200).json({ message: 'Login successful', user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
