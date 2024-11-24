import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.query; // Assuming the ID is passed in the query string
    console.log(id);
    
    if (!id) {
      return res.status(400).json({ error: 'Route ID is required' });
    }

    try {
      // Start a transaction to ensure both deletions succeed or fail together
      await pool.query('BEGIN');

      // Delete associated posts
      const deletePostsResult = await pool.query('DELETE FROM posts WHERE route_id = $1 RETURNING *', [id]);

      // Delete the route
      const deleteRouteResult = await pool.query('DELETE FROM routes WHERE id = $1 RETURNING *', [id]);

      if (deleteRouteResult.rowCount === 0) {
        // Rollback if the route doesn't exist
        await pool.query('ROLLBACK');
        return res.status(404).json({ error: 'Route not found' });
      }

      // Commit the transaction
      await pool.query('COMMIT');

      res.status(200).json({
        message: 'Route and associated posts deleted successfully',
        route: deleteRouteResult.rows[0],
        posts: deletePostsResult.rows,
      });
    } catch (error) {
      console.error('Error deleting route and associated posts:', error);
      // Rollback the transaction on error
      await pool.query('ROLLBACK');
      res.status(500).json({ error: 'Failed to delete route and associated posts' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
