import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.query; // Assuming the ID is passed in the query string

    if (!id) {
      return res.status(400).json({ error: 'Route ID is required' });
    }

    try {
      // Delete the route with the provided ID
      const result = await pool.query('DELETE FROM routes WHERE id = $1 RETURNING *', [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Route not found' });
      }

      res.status(200).json({ message: 'Route deleted successfully', route: result.rows[0] });
    } catch (error) {
      console.error('Error deleting route:', error);
      res.status(500).json({ error: 'Failed to delete route' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
