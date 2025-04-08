"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, CircularProgress, Alert } from "@mui/material";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts from the API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/regularPosts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress color="primary" />
      </div>
    );
  }

  // Error Handling
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-slate-900 text-white py-10 mb-10">
        <Container>
          <Typography variant="h3" className="font-light "> Blog
          </Typography>
          <Typography variant="subtitle1" className="text-gray-300  mt-2">
            Your source for the latest insights, tips, and stories.
          </Typography>
        </Container>
      </header>

      {/* Blog Posts */}
      <Container>
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <Typography variant="h5" className="text-gray-600">
              No posts available at the moment. Check back soon!
            </Typography>
          </div>
        ) : (
          <Grid container spacing={4}>
            {posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <Card className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  {/* Featured Image */}
                  {post?.featured_image ? (
                    <CardMedia>
                      <Image
                        width={600}
                        height={400}
                        className="w-full h-48 object-cover border-b border-gray-300 rounded-t-lg"
                        src={post.featured_image}
                        alt={post.title}
                      />
                    </CardMedia>
                  ) : null}

                  {/* Content */}
                  <CardContent>
                    <Typography variant="h6" className="text-gray-800 font-light mb-2">
                      {post.title}
                    </Typography>

                    {/* Read More Button */}
                    <Link href={`/blog/${post.slug}`} passHref>
                      <Button variant="contained" color="primary" className="mt-3 normal-case bg-sky-500 hover:bg-sky-600">
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
}
