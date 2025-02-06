"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Grid, Card, CardContent, Typography, Button, Container, Alert } from "@mui/material";

// Fetch posts from the API
async function fetchPosts() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const res = await fetch(`${API_URL}/api/posts`);

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

export default function PostListPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const postsData = await fetchPosts();
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    getPosts();
  }, []);

  return (
    <Container maxWidth="lg" className="py-12">
      {/* Header Section */}
      <header className="text-center mb-12">
        <Typography variant="h4" fontWeight={700} className="text-gray-800">
          Route Posts
        </Typography>
        <Typography variant="body1" color="textSecondary" className="mt-2">
          Browse and manage your route posts.
        </Typography>
      </header>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <Grid container spacing={4}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} className="text-gray-900 mb-2">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" className="mb-4">
                    <strong>Posted on:</strong> {new Date(post.created_at).toLocaleDateString()}
                  </Typography>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center">
                    <Link href={`/posts/${post.slug}`} passHref>
                      <Button variant="contained" color="primary" size="small">
                        View
                      </Button>
                    </Link>
                    <Link href={`/posts/edit/${post.id}`} passHref>
                      <Button variant="outlined" color="primary" size="small">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info" className="text-center mt-12">
          No posts available. Create a new one to get started!
        </Alert>
      )}
    </Container>
  );
}
