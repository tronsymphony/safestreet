import bcrypt from 'bcryptjs';
import pool from '../../lib/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Ensure only POST requests are allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { email, password } = req.body;

  // Validate input
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

    // Verify the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET, // Ensure this is set in your environment variables
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Set the JWT token in an HTTP-only cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      path: '/', // Cookie is accessible across the entire site
      maxAge: 3600, // Cookie expires in 1 hour (matches JWT expiration)
      secure: isProduction, // Only send the cookie over HTTPS in production
      sameSite: 'strict', // Prevent CSRF attacks
    };

    res.setHeader(
      'Set-Cookie',
      `token=${token}; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`
    );

    // Return success response with user information (excluding sensitive data)
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
}