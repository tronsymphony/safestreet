'use client';
import React, { useState, useEffect } from 'react';
import MapboxDrawComponent from "../../components/map-single-view";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { renderEditorContent } from "../../../utils/renderEditorContent";
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

  // Handle user authentication
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

  // Fetch post data
  useEffect(() => {
    const getPost = async () => {
      try {
        const fetchedPost = await fetchPost(slug);

        // Parse the JSON content if needed
        fetchedPost.content =
          typeof fetchedPost.content === 'string'
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
      <div className="container mx-auto p-6 mt-10 bg-slate-100 shadow-md rounded-lg text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-gray-600">Could not fetch the post. Please try again later.</p>
      </div>
    );
  }

  if (!post || loading) {
    return (
      <div className="container mx-auto p-6 mt-10 bg-slate-100 shadow-md rounded-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto mb-20">
      {/* Featured Image */}
      {post.featured_image && (
        <div className="mb-8">
          <Image
            src={post.featured_image}
            alt={post.title}
            height={400}
            width={1200}
            className="w-full max-h-96 object-contain bg-slate-400"
          />
        </div>
      )}

      {/* Post Content */}
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
          {post.title}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Published on {new Date(post.created_at).toLocaleDateString()}
        </p>
        <hr className="my-6 border-gray-300" />
        <div className="prose prose-slate max-w-none text-gray-800 leading-relaxed">
          {renderEditorContent(post.content)}
        </div>
      </div>

      {/* Footer or Map Component */}
      {post.map_location && (
        <div className="mt-12 max-w-6xl mx-auto px-4">
          <MapboxDrawComponent location={post.map_location} />
        </div>
      )}
    </div>
  );
}
