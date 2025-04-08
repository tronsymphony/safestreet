import pool from "../../lib/db";

// ✅ Helper function to check if a string is a valid UUID
const isValidUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { slug, user_id } = req.query;

    if (!slug) {
      return res.status(400).json({ error: "Slug is required" });
    }

    try {
      // ✅ Fetch post details
      const postQuery = `
        SELECT 
          posts.id AS post_id,
          posts.title,
          posts.slug,
          posts.featured_image,
          posts.route_condition,
          posts.route_city,
          posts.content,
          posts.created_at,
          posts.updated_at,
          posts.route_id
        FROM 
          posts
        WHERE 
          posts.slug = $1
      `;

      const postResult = await pool.query(postQuery, [slug]);

      if (postResult.rows.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      const post = postResult.rows[0];

      // ✅ Fetch route details
      const routeQuery = `
        SELECT 
          coordinates
        FROM 
          routes
        WHERE 
          id = $1
      `;

      const routeResult = await pool.query(routeQuery, [post.route_id]);

      if (routeResult.rows.length === 0) {
        return res.status(404).json({ error: "Associated route not found" });
      }

      // ✅ Fetch total likes dynamically from `likes` table
      const likeCountQuery = `
        SELECT COUNT(*) AS total_likes
        FROM likes
        WHERE route_id = $1
      `;

      const likeCountResult = await pool.query(likeCountQuery, [post.route_id]);
      const totalLikes = parseInt(likeCountResult.rows[0]?.total_likes || 0, 10);

      // ✅ Check if the user has liked the post (only if `user_id` is a valid UUID)
      let userHasLiked = false;
      if (user_id && isValidUUID(user_id)) {
        const likeQuery = `
          SELECT 1 
          FROM likes
          WHERE route_id = $1 AND user_id = $2
        `;

        const likeResult = await pool.query(likeQuery, [post.route_id, user_id]);
        userHasLiked = likeResult.rows.length > 0;
      }

      // ✅ Combine post data with route and like information
      const routeData = routeResult.rows[0];
      const combinedData = {
        ...post,
        route: routeData.coordinates,
        like_count: totalLikes,
        user_has_liked: userHasLiked,
      };

      res.status(200).json(combinedData);
    } catch (error) {
      console.error("Error fetching post and route data:", error);
      res.status(500).json({ error: "Failed to fetch post and route data" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: "Method not allowed" });
  }
}
