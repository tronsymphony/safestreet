import pool from "../../../lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const query = `
        SELECT 
          id,
          title,
          description,
          city,
          coordinates,
          featured_image AS image_url,
          created_at
        FROM locations
        WHERE id = $1
      `;
      const values = [id];
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Location not found" });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching location:", error);
      res.status(500).json({ error: "Failed to fetch location" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
