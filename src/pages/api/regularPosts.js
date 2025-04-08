// /pages/api/regularPosts.js
import { nanoid } from 'nanoid';
import pool from '../../lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
    const { method, query: { id, author, slug } } = req;
    
    // Get the authenticated user session
    const session = await getServerSession(req, res, authOptions);

    switch (method) {
        case 'POST': {
            const { title, content, featuredImage, author } = req.body;

            if (!title || !content || !author) {
                return res.status(400).json({ error: 'Title, content, and author are required.' });
            }
            
            // Check if user is authenticated
            if (!session?.user?.id) {
                return res.status(401).json({ error: 'You must be logged in to create a post.' });
            }

            // Generate a unique slug
            const slug = `${title.toLowerCase().replace(/\s+/g, '-')}-${nanoid(6)}`;

            try {
                const query = `
                    INSERT INTO blog_posts (title, slug, content, featured_image, likes, author, user_id, created_at, updated_at)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
                    RETURNING *`;
                const values = [title, slug, content, featuredImage || null, 0, author, session.user.id];

                const result = await pool.query(query, values);
                return res.status(201).json(result.rows[0]);
            } catch (error) {
                console.error('Error creating post:', error);
                return res.status(500).json({ error: 'Failed to create post', details: error.message });
            }
        }

        case 'GET': {
            try {
                if (slug) {
                    // Fetch a single post by slug
                    const result = await pool.query('SELECT * FROM blog_posts WHERE slug = $1', [slug]);
                    if (result.rows.length === 0) {
                        return res.status(404).json({ error: 'Post not found' });
                    }
                    return res.status(200).json(result.rows[0]);
                } else if (id) {
                    // Fetch a single post by ID
                    const result = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [id]);
                    if (result.rows.length === 0) {
                        return res.status(404).json({ error: 'Post not found' });
                    }
                    return res.status(200).json(result.rows[0]);
                } else if (author) {
                    // Fetch all posts by the specified author
                    const result = await pool.query('SELECT * FROM blog_posts WHERE author = $1 ORDER BY created_at DESC', [author]);
                    return res.status(200).json(result.rows);
                } else {
                    // Fetch all posts
                    const result = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
                    return res.status(200).json(result.rows);
                }
            } catch (error) {
                console.error('Error retrieving posts:', error);
                return res.status(500).json({ error: 'Failed to retrieve posts' });
            }
        }

        case 'PUT': {
            if (!id) {
                return res.status(400).json({ error: 'Post ID is required for updating' });
            }
            
            // Check if user is authenticated
            if (!session?.user?.id) {
                return res.status(401).json({ error: 'You must be logged in to update a post.' });
            }
        
            const { title, content, featuredImage } = req.body;
            const updatedFields = [];
            const values = [];
        
            if (title) {
                updatedFields.push('title = $' + (values.length + 1));
                values.push(title);
            }
            if (content) {
                updatedFields.push('content = $' + (values.length + 1));
                values.push(content);
            }
            if (featuredImage) {
                updatedFields.push('featured_image = $' + (values.length + 1));
                values.push(featuredImage);
            }
            if (updatedFields.length === 0) {
                return res.status(400).json({ error: 'At least one field is required for update' });
            }
        
            values.push(id); // Add ID as the last parameter
            
            // Add user_id check to ensure users can only update their own posts
            values.push(session.user.id); // Add user ID for authorization check
        
            try {
                // First check if the post belongs to the authenticated user
                const authQuery = `SELECT * FROM blog_posts WHERE id = $1 AND user_id = $2`;
                const authResult = await pool.query(authQuery, [id, session.user.id]);
                
                if (authResult.rows.length === 0) {
                    return res.status(403).json({ error: 'You can only update your own posts' });
                }
                
                const query = `
                    UPDATE blog_posts
                    SET ${updatedFields.join(', ')}, updated_at = NOW()
                    WHERE id = $${values.length - 1}
                    RETURNING *`;
                    
                // Remove the user_id from values since we only used it for authorization check
                values.pop();
                
                const result = await pool.query(query, values);
                return res.status(200).json(result.rows[0]);
            } catch (error) {
                console.error('Error updating post:', error);
                return res.status(500).json({ error: 'Failed to update post' });
            }
        }
        
        case 'DELETE': {
            if (!id) {
                return res.status(400).json({ error: 'Post ID is required for deletion' });
            }
            
            // Check if user is authenticated
            if (!session?.user?.id) {
                return res.status(401).json({ error: 'You must be logged in to delete a post.' });
            }

            try {
                // First check if the post belongs to the authenticated user
                const authQuery = `SELECT * FROM blog_posts WHERE id = $1 AND user_id = $2`;
                const authResult = await pool.query(authQuery, [id, session.user.id]);
                
                if (authResult.rows.length === 0) {
                    return res.status(403).json({ error: 'You can only delete your own posts' });
                }
                
                const result = await pool.query('DELETE FROM blog_posts WHERE id = $1 RETURNING *', [id]);
                return res.status(200).json({ message: 'Post deleted successfully', post: result.rows[0] });
            } catch (error) {
                console.error('Error deleting post:', error);
                return res.status(500).json({ error: 'Failed to delete post' });
            }
        }

        default:
            res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
            return res.status(405).end(`Method ${method} Not Allowed`);
    }
}