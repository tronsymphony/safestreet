'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Fetch posts from the API
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
    <div className="container mx-auto py-12 px-4">
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Route Posts</h1>
        <p className="text-gray-500 mt-2">Browse and manage your route posts.</p>
      </header>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">{post.title}</h2>
              <p className="text-gray-500 text-sm mb-4">
                <span className="font-medium">Posted on:</span> {new Date(post.created_at).toLocaleDateString()}
              </p>
              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <Link
                  href={`/posts/${post.slug}`}
                  passHref
                  className="inline-block bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition"
                >
                  View
                </Link>
                <Link
                  href={`/posts/edit/${post.id}`}
                  passHref
                  className="inline-block text-sky-500 border border-sky-500 px-4 py-2 rounded-lg hover:bg-sky-500 hover:text-white transition"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Posts State */}
      {posts.length === 0 && (
        <div className="text-center mt-12">
          <p className="text-lg font-medium text-gray-500">
            No posts available. Create a new one to get started!
          </p>
        </div>
      )}
    </div>
  );
}
