'use client'
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, CardActions, Button, Grid } from '@mui/material';
import Link from 'next/link';

async function fetchPosts() {
  const res = await fetch('http://localhost:3000/api/posts');

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }

  const posts = await res.json();
  return posts;
}

export default function PostListPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const postsData = await fetchPosts();
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    getPosts();
  }, []);

  return (
    <Container maxWidth="md" style={{ padding: '2rem 0' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Blog Posts
      </Typography>
      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <Card elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
              <CardContent>
                <Typography variant="h4" component="h2" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="caption" display="block" gutterBottom>
                  Posted on: {new Date(post.created_at).toLocaleDateString()}
                </Typography>
               
              </CardContent>
              <CardActions>
                <Link href={`/posts/${post.slug}`} passHref>
                  <Button variant="contained" color="primary">
                    Read More
                  </Button>
                </Link>
                <Link href={`/posts/edit/${post.id}`} passHref>
                  <Button variant="outlined" color="secondary">
                    Edit Post
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
