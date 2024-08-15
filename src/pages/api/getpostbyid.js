import pool from '../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // Query the database for the post with the given id
      const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);

      // If no post is found, return a 404 error
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Return the post data
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ error: 'Failed to fetch post' });
    }
  } else {
    // If the method is not GET, return a 405 Method Not Allowed response
    res.status(405).json({ message: 'Method not allowed' });
  }
}
