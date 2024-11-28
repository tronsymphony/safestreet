import pool from "../../lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const query = `
        SELECT 
          id, 
          title, 
          slug, 
          description, 
          featured_image, 
          city, 
          coordinates,
          created_at, 
          updated_at 
        FROM locations 
        WHERE id = $1
      `;
      const values = [id];
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching post by id:", error);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
