import pool from '../../lib/db';

export default async function handler(req, res) {

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve posts' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
