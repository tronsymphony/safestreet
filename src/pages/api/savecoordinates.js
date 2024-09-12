import {generateSlug} from '../../lib/generateSlug';
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

      let slug = generateSlug(postTitle);
      let slugExists = true;
      let attempt = 1;

      while (slugExists) {
        const existingSlug = await client.query('SELECT * FROM posts WHERE slug = $1', [slug]);
        if (existingSlug.rows.length > 0) {
          // If slug exists, modify the slug by appending a number
          slug = `${generateSlug(postTitle)}-${attempt}`;
          attempt += 1;
        } else {
          slugExists = false;
        }
      }

      const postResult = await client.query(
        'INSERT INTO posts (title, content, route_id, slug) VALUES ($1, $2, $3, $4) RETURNING *',
        [postTitle, postContent, routeId, slug]
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
