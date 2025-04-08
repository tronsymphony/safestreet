import pool from '../../lib/db';

// ✅ Helper function to check if a string is a valid UUID
const isValidUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export default async function handler(req, res) {
  const { method } = req;
  const { route_id, user_id } = req.body;

  if (!route_id || !user_id) {
    return res.status(400).json({ error: 'Route ID and User ID are required' });
  }

  if (!isValidUUID(route_id) || !isValidUUID(user_id)) {
    return res.status(400).json({ error: 'Invalid Route ID or User ID format' });
  }

  if (method === 'POST') {
    try {
      // ✅ Check if user has already liked this route
      const checkLike = await pool.query(
        'SELECT 1 FROM likes WHERE route_id = $1 AND user_id = $2',
        [route_id, user_id]
      );

      if (checkLike.rows.length > 0) {
        return res.status(400).json({ error: 'You have already liked this route' });
      }

      // ✅ Insert new like
      await pool.query('INSERT INTO likes (route_id, user_id) VALUES ($1, $2)', [route_id, user_id]);
      
      // ✅ Ensure like_count column exists before updating
      await pool.query('UPDATE routes SET like_count = COALESCE(like_count, 0) + 1 WHERE id = $1', [route_id]);

      // ✅ Get updated like count
      const result = await pool.query('SELECT like_count FROM routes WHERE id = $1', [route_id]);
      res.status(200).json({ like_count: result.rows[0]?.like_count || 0 });
    } catch (error) {
      console.error('Error adding like:', error);
      res.status(500).json({ error: 'Failed to add like' });
    }
  } else if (method === 'DELETE') {
    try {
      // ✅ Check if the user has liked the route
      const checkLike = await pool.query(
        'SELECT 1 FROM likes WHERE route_id = $1 AND user_id = $2',
        [route_id, user_id]
      );

      if (checkLike.rows.length === 0) {
        return res.status(400).json({ error: 'You have not liked this route' });
      }

      // ✅ Remove like
      await pool.query('DELETE FROM likes WHERE route_id = $1 AND user_id = $2', [route_id, user_id]);

      // ✅ Ensure like_count column exists before updating
      await pool.query('UPDATE routes SET like_count = GREATEST(COALESCE(like_count, 1) - 1, 0) WHERE id = $1', [route_id]);

      // ✅ Get updated like count
      const result = await pool.query('SELECT like_count FROM routes WHERE id = $1', [route_id]);
      res.status(200).json({ like_count: result.rows[0]?.like_count || 0 });
    } catch (error) {
      console.error('Error removing like:', error);
      res.status(500).json({ error: 'Failed to remove like' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'DELETE']);
    res.status(405).json({ error: `Method ${method} not allowed` });
  }
}
