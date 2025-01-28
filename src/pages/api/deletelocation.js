import pool from "../../lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      // Delete the location from the database
      const query = "DELETE FROM locations WHERE id = $1 RETURNING *";
      const values = [id];
      const result = await pool.query(query, values);

      // Check if the location was found and deleted
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Location not found" });
      }

      res.status(200).json({ message: "Location deleted successfully", location: result.rows[0] });
    } catch (error) {
      console.error("Error deleting location:", error);
      res.status(500).json({ error: "Failed to delete location" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
