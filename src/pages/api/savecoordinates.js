import bcrypt from 'bcryptjs';
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { route, postTitle, postContent } = req.body;

    if (!route || !postTitle || !postContent) {
      return res.status(400).json({ error: 'Route, post title, and post content are required' });
    }

    const client = await pool.connect(); // Start a transaction

    try {

      await client.query('BEGIN'); // Start transaction
      
      const coordinatesJson = JSON.stringify(route);

      const routeResult = await client.query(
        'INSERT INTO routes (route) VALUES ($1) RETURNING id',
        [coordinatesJson]
      );

      const routeId = routeResult.rows[0].id;

      const postResult = await client.query(
        'INSERT INTO posts (title, content, route_id) VALUES ($1, $2, $3) RETURNING *',
        [postTitle, postContent, routeId]
      );

      await client.query('COMMIT');

      res.status(201).json({
        route: routeResult.rows[0],
        post: postResult.rows[0],
      });
      
    } catch (error) {
      await client.query('ROLLBACK'); // Rollback transaction on error
      console.error('Error inserting route and post:', error);
      res.status(500).json({ error: 'Route and post registration failed' });
    } finally {
      client.release(); // Release the client back to the pool
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
