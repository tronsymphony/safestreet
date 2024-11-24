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
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8">Route Posts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
              <p className="text-gray-500 mb-4">Posted on: {new Date(post.created_at).toLocaleDateString()}</p>
              <div className="flex justify-between">
                <Link href={`/posts/${post.slug}`} passHref className="text-white bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-lg transition">
                    View
                </Link>
                <Link href={`/posts/edit/${post.id}`} passHref className="text-slate-600 border border-slate-600 hover:bg-slate-600 hover:text-white px-4 py-2 rounded-lg transition">
                    Edit 
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
