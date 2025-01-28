import pool from '../../lib/db';

export default async function handler(req, res) {
  const { method } = req;
  const { route_id, user_id } = req.body;

  if (!route_id) {
    return res.status(400).json({ error: 'Route ID is required' });
  }

  if (method === 'POST') {
    try {

      const checkLike = await pool.query(
        'SELECT * FROM likes WHERE route_id = $1 AND user_id = $2',
        [route_id, user_id]
      );

      if (checkLike.rows.length > 0) {
        return res.status(400).json({ error: 'You have already liked this route' });
      }

      await pool.query('INSERT INTO likes (route_id, user_id) VALUES ($1, $2)', [route_id, user_id]);
      await pool.query('UPDATE routes SET like_count = like_count + 1 WHERE id = $1', [route_id]);

      const result = await pool.query('SELECT like_count FROM routes WHERE id = $1', [route_id]);
      res.status(200).json({ like_count: result.rows[0].like_count });
    } catch (error) {
      console.error('Error adding like:', error);
      res.status(500).json({ error: 'Failed to add like' });
    }
  } else if (method === 'DELETE') {
    // Remove a like
    try {
      // Check if the user has liked the route
      const checkLike = await pool.query(
        'SELECT * FROM likes WHERE route_id = $1 AND user_id = $2',
        [route_id, user_id]
      );

      if (checkLike.rows.length === 0) {
        return res.status(400).json({ error: 'You have not liked this route' });
      }

      await pool.query('DELETE FROM likes WHERE route_id = $1 AND user_id = $2', [route_id, user_id]);
      await pool.query('UPDATE routes SET like_count = like_count - 1 WHERE id = $1', [route_id]);


      const result = await pool.query('SELECT like_count FROM routes WHERE id = $1', [route_id]);
      res.status(200).json({ like_count: result.rows[0].like_count });
    } catch (error) {
      console.error('Error removing like:', error);
      res.status(500).json({ error: 'Failed to remove like' });
    }
  } else {
    res.setHeader('Allow', ['GET','POST', 'DELETE']);
    res.status(405).json({ error: `Method ${method} not allowed` });
  }
}
