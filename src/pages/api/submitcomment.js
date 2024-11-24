import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { page_id, page_type, author_id, author, content } = req.body;

    if (!page_id || !page_type || !author_id || !author || !content) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const query = `
        INSERT INTO comments (page_id, page_type, author_id, author, content, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *`;
      const values = [page_id, page_type, author_id, author, content];

      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ error: 'Failed to add comment' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
