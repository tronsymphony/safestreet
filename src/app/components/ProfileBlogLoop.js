"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Grid, Card, CardMedia, CardContent, Typography, Button, Container, Alert } from "@mui/material";

// Fetch posts by author
async function fetchPosts(author) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const url = author
    ? `${API_URL}/api/regularPosts?author=${encodeURIComponent(author)}`
    : `${API_URL}/api/regularPosts`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

export default function ProfileBlogLoop() {
  const [posts, setPosts] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const getPosts = async () => {
      try {
        if (session?.user?.email) {
          const postsData = await fetchPosts(session.user.email);
          setPosts(postsData);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    if (session) {
      getPosts();
    }
  }, [session]);

  return (
    <Container maxWidth="lg" className="py-12">
      {/* Header Section */}
      <header className="text-center mb-12">
        <Typography variant="h4" fontWeight={700} className="text-gray-800">
          Your Blog Posts
        </Typography>
        <Typography variant="body1" color="textSecondary" className="mt-2">
          Manage and edit your authored blog posts here.
        </Typography>
      </header>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <Grid container spacing={4}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                {/* Featured Image */}
                {post.featured_image && (
                  <CardMedia>
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      height={300}
                      width={500}
                      priority
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </CardMedia>
                )}

                {/* Post Content */}
                <CardContent>
                  <Typography variant="h6" fontWeight={600} className="text-gray-900 mb-2">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" className="mb-4">
                    <strong>Posted on:</strong> {new Date(post.created_at).toLocaleDateString()}
                  </Typography>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center">
                    <Link href={`/blog/${post.slug}`} passHref>
                      <Button variant="contained" color="primary" size="small">
                        Read More
                      </Button>
                    </Link>
                    <Link href={`/blog/edit/${post.id}`} passHref>
                      <Button variant="outlined" color="primary" size="small">
                        Edit Post
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <div className="text-center mt-12">
          <Alert severity="info" className="mb-4">
            You have no blog posts yet. Start creating one!
          </Alert>
        </div>
      )}
    </Container>
  );
}
