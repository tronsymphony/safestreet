'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts from the API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/regularPosts'); // Fetch all posts
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data); // Set fetched posts to state
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">

      {/* Main Content */}
      <header className="bg-slate-900 text-white py-10 mb-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">My Awesome Blog</h1>
          <p className="text-gray-300 text-lg">
            Your source for the latest insights, tips, and stories.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No posts available at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-md shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <Image
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover border-b-4 border-slate-500"
                  src={post.featured_image || 'https://via.placeholder.com/600x400'}
                  alt={post.title}
                />
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    {post.title}
                  </h2>
                  <a
                    href={`/blog/${post.slug}`}
                    className="inline-block px-4 py-2 text-sm font-semibold uppercase bg-sky-500 text-white rounded-full hover:bg-sky-600 transition"
                  >
                    Read More
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}
