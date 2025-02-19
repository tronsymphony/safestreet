import pool from '../../lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]"; // Ensure correct NextAuth config import

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // ✅ Get the authenticated session
      const session = await getServerSession(req, res, authOptions);

      if (!session || !session.user) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
      }

      const userId = session.user.id; // ✅ Get the logged-in user ID

      // ✅ Fetch posts only by the logged-in user
      const result = await pool.query(
        'SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(200).json({ message: "No posts found for this user.", posts: [] });
      }

      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error retrieving posts:", error);
      res.status(500).json({ error: 'Failed to retrieve posts' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
