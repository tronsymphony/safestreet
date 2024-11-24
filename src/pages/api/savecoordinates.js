import { generateSlug } from '../../lib/generateSlug';
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { route, postTitle, postContent, featuredImage, routeCondition, routeCity } = req.body;

    if (!route || !postTitle || !postContent) {
      return res.status(400).json({ error: 'Route, post title, and post content are required' });
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const coordinatesJson = JSON.stringify(route);

      const routeResult = await client.query(
        'INSERT INTO routes (route) VALUES ($1) RETURNING id',
        [coordinatesJson]
      );

      const routeId = routeResult.rows[0].id;

      let slug = generateSlug(postTitle);
      let slugExists = true;
      let attempt = 1;
      const maxRetries = 10;

      while (slugExists && attempt <= maxRetries) {
        const existingSlug = await client.query('SELECT * FROM posts WHERE slug = $1', [slug]);
        if (existingSlug.rows.length > 0) {
          slug = `${generateSlug(postTitle)}-${attempt}`;
          attempt += 1;
        } else {
          slugExists = false;
        }
      }

      if (slugExists) {
        throw new Error('Unable to generate a unique slug after 10 attempts.');
      }

      const postResult = await client.query(
        'INSERT INTO posts (title, content, route_id, slug, featured_image, route_condition, route_city) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [postTitle, postContent, routeId, slug, featuredImage, routeCondition, routeCity]
      );

      await client.query('COMMIT');

      res.status(201).json({
        route: routeResult.rows[0],
        post: postResult.rows[0],
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error inserting route and post:', error);
      res.status(500).json({
        error: process.env.NODE_ENV === 'development'
          ? `Route and post registration failed: ${error.message}`
          : 'Route and post registration failed',
      });
    } finally {
      client.release();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
