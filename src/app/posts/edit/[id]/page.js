'use client';
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, CircularProgress, Box } from '@mui/material';
import Editor from '../../../components/PostEditor'; 

export default function EditPostPage({ params }) {
  const { id } = params;  // Accessing the dynamic segment directly from params
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);  // For handling loading state

  useEffect(() => {
    const getPost = async () => {
      try {
        const post = await fetchPost(id);
        const blocks = JSON.parse(post.content);
        const postData = {
          time: new Date(post.updated_at).getTime(),
          blocks: [
            {
              type: 'header',
              data: {
                text: post.title,
                level: 1,
              },
            },
            ...blocks,
          ],
        };
        setData(postData);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);  // Set loading to false once data is fetched
      }
    };

    if (id) {
      getPost();
    }
  }, [id]);

  const handleSave = async (postData) => {
    try {
      const titleBlock = postData.blocks.find(block => block.type === 'header');
      const contentBlocks = postData.blocks.filter(block => block.type !== 'header');

      const postContent = {
        title: titleBlock ? titleBlock.data.text : 'Untitled',
        content: JSON.stringify(contentBlocks),
        updated_at: new Date().toISOString(),
      };

      const response = await fetch(`/api/updatepost?id=${id}`, { // Ensure correct query string
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postContent),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Post updated successfully!', data);

      // Redirect or display a success message
      alert('Post updated successfully!');
      // window.location.href = '/some-other-page'; // Redirect if necessary
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>Loading...</Typography>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6">No post data found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Post
      </Typography>
      <Editor data={data} onChange={setData} editorblock="editorjs-container" />
      <Box sx={{ textAlign: 'right', mt: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleSave(data)}
        >
          Save Changes
        </Button>
      </Box>
    </Container>
  );
}

async function fetchPost(id) {
  const res = await fetch(`/api/getpostbyid?id=${id}`);

  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }

  const post = await res.json();
  return post;
}
