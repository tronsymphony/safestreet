import pool from "../../lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const { title, description, featured_image, city, coordinates } = req.body;

    // Validate fields
    if (!id || !title || !description || !city || !coordinates || coordinates.length !== 2) {
      return res.status(400).json({ error: "Missing or invalid fields in request body" });
    }

    try {
      const query = `
        UPDATE locations 
        SET 
          title = $1, 
          description = $2, 
          featured_image = $3, 
          city = $4, 
          coordinates = $5::jsonb, 
          updated_at = NOW() 
        WHERE id = $6 
        RETURNING *
      `;
      const values = [
        title,
        description,
        featured_image,
        city,
        JSON.stringify(coordinates), // Convert coordinates array to JSON string
        id,
      ];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Location not found" });
      }

      res.status(200).json({ message: "Location updated successfully", location: result.rows[0] });
    } catch (error) {
      console.error("Error updating location:", error);
      res.status(500).json({ error: "Failed to update location" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
