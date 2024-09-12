import bcrypt from 'bcryptjs';
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { route } = req.body;

    if (!route) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }

    try {
      const coordinatesJson = JSON.stringify(route);

      const result = await pool.query(
        'INSERT INTO routes (route) VALUES ($1) RETURNING *',
        [coordinatesJson]
      );

      res.status(201).json({ route: result.rows[0] });
    } catch (error) {
      console.error('Error inserting route:', error);
      res.status(500).json({ error: 'route registration failed' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
