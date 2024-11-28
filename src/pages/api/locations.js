import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Query to fetch all locations
      const query = `
        SELECT 
          id,
          title,
          description,
          city,
          coordinates,
          featured_image AS image_url,
          created_at
        FROM locations
        ORDER BY created_at DESC
      `;

      const result = await pool.query(query);

      // Return the locations in the response
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching locations:', error);
      res.status(500).json({ error: 'Failed to fetch locations' });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
