import pool from '../../lib/db';

export default async function handler(req, res) {
  const { method, query: { id } } = req;

  if (method === 'GET') {
    try {
      const query = `
        SELECT 
            posts.id AS post_id,
            posts.title,
            posts.slug,
            posts.content,
            posts.created_at,
            posts.updated_at,
            routes.like_count
        FROM 
            posts
        JOIN 
            routes
        ON 
            posts.route_id = routes.id
        WHERE 
            posts.id = $1;
      `;
      const values = [id]; // Replace with the desired post ID

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching post with like_count:', error);
      res.status(500).json({ error: 'Failed to fetch post' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${method} not allowed` });
  }
}
