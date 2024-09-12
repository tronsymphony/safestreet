'use client';
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card } from '@mui/material';
import MapboxDrawComponent from "../../components/map-single-view";

async function fetchPost(id) {
  const res = await fetch(`/api/getpostbyid?id=${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }

  const post = await res.json();
  return post;
}

export default function PostPage({ params }) {
  const { id } = params;
  const [post, setPost] = useState(null); // State to store the post data
  const [error, setError] = useState(null); // State to manage errors
  const [pageId, setPageId] = useState(id); // Store pageId state

  // Fetch the post data using useEffect
  useEffect(() => {
    const getPost = async () => {
      try {
        const fetchedPost = await fetchPost(id);
        setPost(fetchedPost); // Set post data in the state
      } catch (err) {
        setError('Failed to fetch post');
        console.error('Error fetching post:', err);
      }
    };

    getPost(); // Call the fetch function
  }, [id]); // Fetch post whenever the id changes

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

  let content;

  // Check if content is JSON or HTML
  if (post.content.startsWith('[') || post.content.startsWith('{')) {
    try {
      // Parse JSON content
      const contentJson = JSON.parse(post.content);
      content = (
        <Box>
          {contentJson.map((block) => {
            if (block.type === 'paragraph') {
              return (
                <Typography variant="body1" key={block.id} paragraph>
                  {block.data.text}
                </Typography>
              );
            }
            // Handle other block types if necessary
            return null;
          })}
        </Box>
      );
    } catch (error) {
      console.error('Failed to parse JSON content:', error);
      content = <p>Error parsing content.</p>;
    }
  } else {
    // Handle HTML content
    content = <Box dangerouslySetInnerHTML={{ __html: post.content }} />;
  }

  return (
    <Container maxWidth="md" style={{ padding: '2rem 0' }}>
      <Card elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
        <Typography variant="h2" component="h1" gutterBottom>{post.title}</Typography>
        <Typography variant="caption" display="block" gutterBottom>
          Posted on: {new Date(post.created_at).toLocaleDateString()}
        </Typography>
        {content}

        {/* Mapbox component to show the route */}
        <MapboxDrawComponent routeId={pageId} />
      </Card>
    </Container>
  );
}
