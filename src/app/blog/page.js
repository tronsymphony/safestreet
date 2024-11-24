'use client';

import React, { useEffect, useState } from 'react';

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
    <div className="min-h-screen mt-10">
      {/* Header */}
      <header className="bg-white mb-10">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-800">My Awesome Blog</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto mt-8 px-4">
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  className="w-full h-48 object-cover"
                  src={post.featured_image || 'https://via.placeholder.com/600x400'}
                  alt={post.title}
                />
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h2>
                  <p className="text-gray-600">{post.content.slice(0, 100)}...</p>
                  <a
                    href={`/blog/${post.slug}`} // Link to the blog post page
                    className="text-blue-500 hover:underline mt-4 block"
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
