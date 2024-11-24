// /pages/api/regularPosts.js
import { nanoid } from 'nanoid';
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, content, featuredImage, author } = req.body;

    // Validation for required fields
    if (!title || !content || !author) {
      return res.status(400).json({ error: 'Title, content, and author are required.' });
    }

    // Generate unique slug
    const slug = `${title.toLowerCase().replace(/\s+/g, '-')}-${nanoid(6)}`;

    try {
      const query = `
        INSERT INTO blog_posts (title, slug, content, featured_image, likes, author, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING *`;
      const values = [title, slug, content, featuredImage || null, 0, author];

      const result = await pool.query(query, values);

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
