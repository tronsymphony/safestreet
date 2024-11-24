import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { slug } = req.query;

    if (!slug) {
      return res.status(400).json({ error: 'Slug is required' });
    }

    try {
      // Query to fetch post data with associated like_count from the routes table
      const postQuery = `
        SELECT 
          posts.id AS post_id,
          posts.title,
          posts.slug,
          posts.content,
          posts.created_at,
          posts.updated_at,
          posts.route_id,
          routes.like_count
        FROM 
          posts
        JOIN 
          routes
        ON 
          posts.route_id = routes.id
        WHERE 
          posts.slug = $1
      `;

      const postResult = await pool.query(postQuery, [slug]);

      // If no post is found, return a 404 error
      if (postResult.rows.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const post = postResult.rows[0];

      // Query to fetch the full route data by route_id
      const routeQuery = `
        SELECT 
          route
        FROM 
          routes
        WHERE 
          id = $1
      `;

      const routeResult = await pool.query(routeQuery, [post.route_id]);

      // If no route is found, return a 404 error
      if (routeResult.rows.length === 0) {
        return res.status(404).json({ error: 'Associated route not found' });
      }

      // Combine post data with route data
      const routeData = routeResult.rows[0];
      const combinedData = { ...post, route: routeData.route };

      // Return the combined data
      res.status(200).json(combinedData);
    } catch (error) {
      console.error('Error fetching post and route data:', error);
      res.status(500).json({ error: 'Failed to fetch post and route data' });
    }
  } else {
    // If the method is not GET, return a 405 Method Not Allowed response
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
