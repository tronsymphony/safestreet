// pages/api/posts.js
import { Client } from 'pg';
import pool from '../../lib/db';
import cors, { runMiddleware } from '../../lib/corsMiddleware';

export default async function handler(req, res) {
    await runMiddleware(req, res, cors);

  if (req.method === 'POST') {
    const { title, content } = req.body;

    try {
      const result = await pool.query(
        'INSERT INTO posts (title, content, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING *',
        [title, content]
      );
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create post' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
