import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { postId } = req.query;

  if (req.method === 'GET') {
    // Fetch all comments for the post
    try {
      const result = await pool.query('SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC', [postId]);
      return res.status(200).json({ comments: result.rows });
    } catch (error) {
      console.error('Error fetching comments:', error);
      return res.status(500).json({ error: 'Error fetching comments' });
    }
  }

  if (req.method === 'POST') {
    const { content, author } = req.body;

    if (!content || !author) {
      return res.status(400).json({ error: 'Content and author are required' });
    }

    try {
      const result = await pool.query(
        'INSERT INTO comments (post_id, content, author, author_id) VALUES ($1, $2, $3) RETURNING *',
        [postId, content, author, author_id]
      );
      return res.status(201).json({ comment: result.rows[0] });
    } catch (error) {
      console.error('Error inserting comment:', error);
      return res.status(500).json({ error: 'Error adding comment' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
