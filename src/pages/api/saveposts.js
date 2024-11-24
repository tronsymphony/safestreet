import { nanoid } from 'nanoid';
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }

    // Generate a slug from the title and append a unique ID for uniqueness
    const slug = `${title.toLowerCase().replace(/\s+/g, '-')}-${nanoid(6)}`;

    try {
      const result = await pool.query(
        'INSERT INTO posts (title, slug, content, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
        [title, slug, content]
      );
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
