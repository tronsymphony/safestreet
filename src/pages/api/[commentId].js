import pool from '../../lib/db';
import { verifyToken } from '../../lib/auth'; // Assuming you have a token verification function

export default async function handler(req, res) {
  const { commentId } = req.query;
  const token = req.headers.authorization?.split(' ')[1]; // Assume JWT token is sent in authorization header

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  const user = verifyToken(token); // This function should decode the token and verify the user's identity

  if (req.method === 'PATCH') {
    // Edit a comment
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    try {
      // Check if the comment belongs to the user or if they are an admin
      const commentResult = await pool.query('SELECT * FROM comments WHERE id = $1', [commentId]);

      if (commentResult.rows.length === 0) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      const comment = commentResult.rows[0];

      if (comment.author_id !== user.id && user.role !== 'admin') {
        return res.status(403).json({ message: 'You do not have permission to edit this comment' });
      }

      // Update the comment content
      const result = await pool.query(
        'UPDATE comments SET content = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [content, commentId]
      );

      return res.status(200).json({ comment: result.rows[0] });
    } catch (error) {
      console.error('Error editing comment:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    // Delete a comment
    try {
      // Check if the comment belongs to the user or if they are an admin
      const commentResult = await pool.query('SELECT * FROM comments WHERE id = $1', [commentId]);

      if (commentResult.rows.length === 0) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      const comment = commentResult.rows[0];

      if (comment.author_id !== user.id && user.role !== 'admin') {
        return res.status(403).json({ message: 'You do not have permission to delete this comment' });
      }

      await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);

      return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
