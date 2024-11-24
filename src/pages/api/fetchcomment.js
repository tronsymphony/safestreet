import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { page_id, page_type } = req.query;

    if (!page_id || !page_type) {
      return res.status(400).json({ error: 'Page ID and type are required' });
    }

    // Validate page_type
    if (!['post', 'blog_post'].includes(page_type)) {
      return res.status(400).json({ error: 'Invalid page type' });
    }

    try {
      const query = `
        SELECT * FROM comments
        WHERE page_id = $1 AND page_type = $2
        ORDER BY created_at DESC`;
      const values = [page_id, page_type];

      const result = await pool.query(query, values);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
