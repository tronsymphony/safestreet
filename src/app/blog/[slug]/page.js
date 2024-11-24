'use client';
import React, { useState, useEffect } from 'react';
import MapboxDrawComponent from "../../components/map-single-view";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { renderEditorContent } from "../../../utils/renderEditorContent"; // Import utility for rendering Editor.js content
import Image from 'next/image';
// Fetch post by slug
async function fetchPost(slug) {
  const res = await fetch(`/api/regularPosts?slug=${slug}`);
  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }

  const post = await res.json();
  return post;
}

export default function PostPage({ params }) {
  const { slug } = params;
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        router.push("/auth/signin");
      } else {
        setSession(session);
        setLoading(false);
      }
    });
  }, [router]);

  useEffect(() => {
    const getPost = async () => {
      try {
        const fetchedPost = await fetchPost(slug);

        // Parse the JSON content if needed
        fetchedPost.content = typeof fetchedPost.content === 'string'
          ? JSON.parse(fetchedPost.content)
          : fetchedPost.content;

        setPost(fetchedPost);
      } catch (err) {
        setError('Failed to fetch post');
        console.error('Error fetching post:', err);
      }
    };

    if (slug) getPost();
  }, [slug]);

  if (error) {
    return (
      <div className="container mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p>Could not fetch the post. Please try again later.</p>
      </div>
    );
  }

  if (!post || loading) {
    return (
      <div className="container mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto mb-20 ">
      {/* Render Featured Image */}
      {post.featured_image && (
        <div className="mb-8">
          <Image
            src={post.featured_image}
            alt={post.title}
            height={200}
            width={1000}
            className="w-full h-[50vh] object-cover"
          />
        </div>
      )}

      <div className="mb-10 max-w-6xl mx-auto px-4">
        <h1 className="text-5xl font-extrabold mb-4 text-gray-800 tracking-tight leading-tight">
          {post.title}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Posted on: {new Date(post.created_at).toLocaleDateString()}
        </p>
        {/* Render Editor.js content */}
        <div className="prose max-w-none mt-6 text-gray-800 prose-lg leading-relaxed">
          {renderEditorContent(post.content)}
        </div>
      </div>

    </div>
  );
}
