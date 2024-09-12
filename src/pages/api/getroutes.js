// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import cors, { runMiddleware } from '../../lib/corsMiddleware';
import pool from '../../lib/db';

export default async function handler(req, res) {

  // Apply CORS middleware
  await runMiddleware(req, res, cors);

  if (req.method === 'GET') {
    try {
      // Join routes with posts to get the slug
      const result = await pool.query(`
        SELECT routes.id, routes.route, routes.created_at, posts.slug, posts.title
        FROM routes 
        LEFT JOIN posts ON posts.route_id = routes.id
        ORDER BY routes.id DESC 
        LIMIT 100
      `);

      if (result.rows.length > 0) {
        res.status(200).json({ routes: result.rows });
      } else {
        res.status(404).json({ error: "routes not found" });
      }

    } catch (error) {
      console.error('Error getting routes:', error);
      res.status(500).json({ error: 'routes getting failed' });
    }

  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
