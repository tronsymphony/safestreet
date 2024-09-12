import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;

    // Ensure the route ID is provided
    if (!id) {
      return res.status(400).json({ error: 'Route ID is required' });
    }

    try {
      // Query the database to get the route with the given ID
      const result = await pool.query('SELECT * FROM routes WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Route not found' });
      }

      // No need to parse JSONB, just return the result directly
      const route = result.rows; // route is already in JSON format due to JSONB
      res.status(200).json({ id: result.rows, route });

    } catch (error) {
      console.error('Error fetching route:', error);
      res.status(500).json({ error: 'Failed to fetch route' });
    }
  } else {
    // Only allow GET requests
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
