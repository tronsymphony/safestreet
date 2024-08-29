import React from 'react';
import Link from 'next/link';
import { Container, Typography, Card, CardContent, CardActions, Button, Grid } from '@mui/material';

async function fetchPosts() {
  const res = await fetch('http://localhost:3000/api/posts', {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  return res.json();
}

export default async function BlogPage() {
  const posts = await fetchPosts();

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Blog Posts
      </Typography>
      <Grid container spacing={4}>
        {posts.map((post) => {
          let content;

          // Check if content is JSON or HTML
          if (post.content.startsWith('[') || post.content.startsWith('{')) {
            try {
              // Parse JSON content
              const contentJson = JSON.parse(post.content);
              content = (
                <div>
                  {contentJson.map((block) => {
                    if (block.type === 'paragraph') {
                      return <Typography variant="body1" key={block.id}>{block.data.text}</Typography>;
                    }
                    // Handle other block types if necessary
                    return null;
                  })}
                </div>
              );
            } catch (error) {
              console.error('Failed to parse JSON content:', error);
              content = <Typography variant="body1" color="error">Error parsing content.</Typography>;
            }
          } else {
            // Handle HTML content
            content = <div dangerouslySetInnerHTML={{ __html: post.content }} />;
          }

          return (
            <Grid item xs={12} key={post.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    <Link href={`/posts/${post.id}`} passHref>
                      <Button color="primary">{post.title}</Button>
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Posted on: {new Date(post.created_at).toLocaleDateString()}
                  </Typography>
                  {content}
                </CardContent>
                <CardActions>
                  <Link href={`/posts/${post.id}`} passHref>
                    <Button size="small" color="primary">Read More</Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
