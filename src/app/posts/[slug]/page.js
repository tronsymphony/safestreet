'use client';
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, TextField, Button } from '@mui/material';
import MapboxDrawComponent from "../../components/map-single-view";
import { useSession } from '../../../lib/SessionContext';

// Fetch post by slug
async function fetchPost(slug) {
  const res = await fetch(`/api/getpostbyslug?slug=${slug}`);
  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }

  const post = await res.json();
  return post;
}

// Fetch comments for the post
async function fetchComments(postId) {
  const res = await fetch(`/api/comments/${postId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch comments');
  }

  const comments = await res.json();
  return comments.comments;
}

// Submit a new comment
async function submitComment(postId, author, content, author_id) {
  const res = await fetch(`/api/comments/${postId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author, content, author_id }),
  });

  if (!res.ok) {
    throw new Error('Failed to submit comment');
  }

  return res.json();
}

export default function PostPage({ params }) {
  const { slug } = params; // Use slug from params
  const [post, setPost] = useState(null); // State to store the post data
  const [error, setError] = useState(null); // State to manage errors
  const [comments, setComments] = useState([]); // State to store comments
  const [newComment, setNewComment] = useState(''); // State to manage new comment content
  const [author, setAuthor] = useState(''); // State to manage the comment author
  const { session } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if session is available, stop loading
    if (session) {
      setLoading(false);
    }
  }, [session]);

  // Fetch the post data using useEffect
  useEffect(() => {
    const getPost = async () => {
      try {
        const fetchedPost = await fetchPost(slug); // Fetch post by slug
        setPost(fetchedPost); // Set post data in the state
        const fetchedComments = await fetchComments(fetchedPost.id); // Fetch comments for the post
        setComments(fetchedComments); // Set comments in the state
      } catch (err) {
        setError('Failed to fetch post');
        console.error('Error fetching post:', err);
      }
    };

    getPost(); // Call the fetch function
  }, [slug]); // Fetch post whenever the slug changes

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!newComment || !author) {
      alert('Please provide both a name and a comment.');
      return;
    }

    try {
      const submittedComment = await submitComment(post.id, author, newComment);
      setComments([submittedComment.comment, ...comments]); // Add new comment to the top of the list
      setNewComment(''); // Reset comment field
      setAuthor(''); // Reset author field
    } catch (err) {
      alert('Failed to submit comment');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" style={{ padding: '4rem 0' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Loading...
        </Typography>
      </Container>
    );
  }

  // Handle the loading and error states
  if (error) {
    return (
      <Container maxWidth="md">
        <Card elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
          <Typography variant="h4" component="h1" gutterBottom>Error</Typography>
          <Typography variant="body1">Could not fetch the post. Please try again later.</Typography>
        </Card>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="md">
        <Card elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
          <Typography variant="h4" component="h1" gutterBottom>Loading...</Typography>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" style={{ padding: '2rem 0' }}>
      <Card elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
        <Typography variant="h2" component="h1" gutterBottom>{post.title}</Typography>
        <Typography variant="caption" display="block" gutterBottom>
          Posted on: {new Date(post.created_at).toLocaleDateString()}
        </Typography>

        <Box dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* Mapbox component to show the route */}
        <MapboxDrawComponent routeId={post.route_id} />
      </Card>

      {/* Comments section */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Comments</Typography>

        {/* Display comments */}
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Card key={comment.id} elevation={1} style={{ marginBottom: '1rem', padding: '1rem' }}>
              <Typography variant="subtitle1">{comment.author}</Typography>
              <Typography variant="body2">{new Date(comment.created_at).toLocaleString()}</Typography>
              <Typography variant="body1" style={{ marginTop: '0.5rem' }}>{comment.content}</Typography>
            </Card>
          ))
        ) : (
          <Typography>No comments yet. Be the first to comment!</Typography>
        )}
      </Box>

      {/* Comment form only loads when session is present */}
      {session && (session.role === 'admin' || session.role === 'subscriber') && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Add a Comment</Typography>
          <TextField
            label="Name"
            fullWidth
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Comment"
            fullWidth
            multiline
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleCommentSubmit}>
            Submit Comment
          </Button>
        </Box>
      )}
    </Container>
  );
}
