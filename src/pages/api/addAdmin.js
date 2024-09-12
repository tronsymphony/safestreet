import bcrypt from 'bcryptjs';
import pool from '../../lib/db'; // Adjust the path based on your project structure

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if the admin user already exists
    const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (checkUser.rows.length > 0) {
      return res.status(409).json({ message: 'Admin user already exists.' });
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the admin user into the database
    await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
      [email, hashedPassword, 'admin']
    );

    return res.status(201).json({ message: 'Admin user created successfully!' });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return res.status(500).json({ message: 'Error creating admin user.' });
  }
}
