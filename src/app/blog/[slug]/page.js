"use client";

import React, { useState, useEffect } from "react";
import MapboxDrawComponent from "../../components/map-single-view";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { renderEditorContent } from "../../../utils/renderEditorContent";
import Image from "next/image";
import { Container, Typography, CircularProgress, Alert, Divider, Card } from "@mui/material";

// Fetch post by slug
async function fetchPost(slug) {
  const res = await fetch(`/api/regularPosts?slug=${slug}`);
  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }
  return res.json();
}

export default function PostPage({ params }) {
  const { slug } = params;
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Handle user authentication
  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        // router.push("/login");
        setLoading(false);
      } else {
        setSession(session);
        setLoading(false);
      }
    });
  }, [router]);

  // Fetch post data
  useEffect(() => {
    const getPost = async () => {
      try {
        const fetchedPost = await fetchPost(slug);

        // Parse the JSON content if needed
        fetchedPost.content =
          typeof fetchedPost.content === "string"
            ? JSON.parse(fetchedPost.content)
            : fetchedPost.content;

        setPost(fetchedPost);
      } catch (err) {
        setError("Failed to fetch post");
        console.error("Error fetching post:", err);
      }
    };

    if (slug) getPost();
  }, [slug]);

  // Error Handling
  if (error) {
    return (
      <Container maxWidth="md" className="py-10">
        <Alert severity="error">
          <Typography variant="h5" fontWeight={600}>Error</Typography>
          <Typography variant="body1">Could not fetch the post. Please try again later.</Typography>
        </Alert>
      </Container>
    );
  }

  // Loading Indicator
  if (!post || loading) {
    return (
      <Container maxWidth="md" className="py-10 flex justify-center">
        <CircularProgress color="primary" />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="pb-12 pt-4">
      {/* Featured Image */}
      {post.featured_image && (
        <Card className="shadow-md mb-8 overflow-hidden">
          <Image
            src={post.featured_image}
            alt={post.title}
            height={400}
            width={1200}
            priority
            className="w-full h-96 object-cover bg-gray-300"
          />
        </Card>
      )}

      {/* Post Content */}
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight={700} className="mb-3 text-gray-900">
          {post.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" className="mb-4">
          Published on {new Date(post.created_at).toLocaleDateString()}
        </Typography>
        <Divider className="my-6" />
        <Typography variant="body1" className="prose prose-slate max-w-none text-gray-800 leading-relaxed">
          {renderEditorContent(post.content)}
        </Typography>
      </Container>

      {/* Map Component */}
      {post.map_location && (
        <Container maxWidth="lg" className="mt-12">
          <MapboxDrawComponent location={post.map_location} />
        </Container>
      )}
    </Container>
  );
}
