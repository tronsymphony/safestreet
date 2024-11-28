import { generateSlug } from '../../lib/generateSlug';
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { coordinates, title, description, city, featuredImage } = req.body;

    if (!coordinates || !title) {
      return res.status(400).json({ error: 'Coordinates and title are required' });
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Generate unique slug
      let slug = generateSlug(title);
      let slugExists = true;
      let attempt = 1;
      const maxRetries = 10;

      while (slugExists && attempt <= maxRetries) {
        const existingSlug = await client.query('SELECT * FROM locations WHERE slug = $1', [slug]);
        if (existingSlug.rows.length > 0) {
          slug = `${generateSlug(title)}-${attempt}`;
          attempt += 1;
        } else {
          slugExists = false;
        }
      }

      if (slugExists) {
        throw new Error('Unable to generate a unique slug after 10 attempts.');
      }

      // Insert the location into the database
      const locationResult = await client.query(
        `INSERT INTO locations (title, description, city, coordinates, featured_image, slug)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [title, description, city, JSON.stringify(coordinates), featuredImage, slug]
      );

      await client.query('COMMIT');

      res.status(201).json({
        location: locationResult.rows[0],
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error inserting location:', error);
      res.status(500).json({
        error: process.env.NODE_ENV === 'development'
          ? `Location registration failed: ${error.message}`
          : 'Location registration failed',
      });
    } finally {
      client.release();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
