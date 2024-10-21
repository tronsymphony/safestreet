// pages/api/routes/[routeId]/like.js
import pool from '../../../../lib/db';
import { verifyToken } from '../../../../lib/authMiddleware';
import cors, { runMiddleware } from '../../../../lib/corsMiddleware';

export default async function handler(req, res) {
    // Apply CORS middleware
    await runMiddleware(req, res, cors);

    verifyToken(req, res, async () => {
        console.log(req.user.id)

        const { routeId } = req.query;
        const userId = req.user.id; // Assuming you have authentication and user session

        if (req.method === 'POST') {
            try {
                // Check if the user has already liked this route
                const checkLike = await pool.query(
                    'SELECT * FROM route_likes WHERE user_id = $1 AND route_id = $2',
                    [userId, routeId]
                );

                if (checkLike.rows.length > 0) {
                    return res.status(400).json({ error: 'You have already liked this route' });
                }

                // Insert a new like into route_likes
                await pool.query(
                    'INSERT INTO route_likes (user_id, route_id) VALUES ($1, $2)',
                    [userId, routeId]
                );

                // Increment the like_count in the routes table
                await pool.query(
                    'UPDATE routes SET like_count = like_count + 1 WHERE id = $1',
                    [routeId]
                );

                res.status(200).json({ message: 'Route liked successfully' });
            } catch (error) {
                console.error('Error liking the route:', error);
                res.status(500).json({ error: 'Failed to like the route' });
            }
        } else {
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    });
}
