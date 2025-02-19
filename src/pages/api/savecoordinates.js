import { generateSlug } from "../../lib/generateSlug";
import pool from "../../lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]"; // Import NextAuth config

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // ✅ Get authenticated user session
  const session = await getServerSession(req, res, authOptions);
  console.log(session, "Session data");

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  const { route, postTitle, postContent, featuredImage, routeCondition, routeCity } = req.body;
  if (!route || !postTitle || !postContent) {
    return res.status(400).json({ error: "Route, post title, and post content are required" });
  }

  const userId = session.user.id; // ✅ Fixed user ID retrieval
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const coordinatesJson = JSON.stringify(route); // ✅ Ensure route is stored

    // ✅ Insert route with user_id and coordinates
    const routeResult = await client.query(
      "INSERT INTO routes (name, description, user_id, coordinates) VALUES ($1, $2, $3, $4) RETURNING id",
      [postTitle, postContent, userId, coordinatesJson] // ✅ Associate with user and store route
    );

    const routeId = routeResult.rows[0].id;

    // ✅ Fix slug generation (ensure unique slug)
    let baseSlug = generateSlug(postTitle);
    let slug = baseSlug;
    let attempt = 1;
    const maxRetries = 10;

    while (attempt <= maxRetries) {
      const existingSlug = await client.query("SELECT 1 FROM posts WHERE slug = $1", [slug]);
      if (existingSlug.rows.length > 0) {
        slug = `${baseSlug}-${attempt}`;
        attempt += 1;
      } else {
        break;
      }
    }

    if (attempt > maxRetries) {
      throw new Error("Unable to generate a unique slug after 10 attempts.");
    }

    // ✅ Insert post with user_id
    const postResult = await client.query(
      "INSERT INTO posts (title, content, route_id, user_id, slug, featured_image, route_condition, route_city) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [postTitle, postContent, routeId, userId, slug, featuredImage, routeCondition, routeCity]
    );

    await client.query("COMMIT");

    res.status(201).json({
      route: routeResult.rows[0],
      post: postResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error inserting route and post:", error);
    res.status(500).json({
      error: process.env.NODE_ENV === "development"
        ? `Route and post registration failed: ${error.message}`
        : "Route and post registration failed",
    });
  } finally {
    client.release();
  }
}
