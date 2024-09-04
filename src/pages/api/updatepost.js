import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { id } = req.query; // Access the post ID from the query string
    const { title, content } = req.body; // Get the post data from the request body

    try {
      const result = await pool.query(
        'UPDATE posts SET title = $2, content = $3, updated_at = NOW() WHERE id = $1 RETURNING *',
        [id, title, content]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Failed to update post:', error);
      res.status(500).json({ error: 'Failed to update post' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
