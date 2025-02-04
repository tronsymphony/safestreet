'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

// Fetch posts from the API by author if provided
async function fetchPosts(author) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const url = author
    ? `${API_URL}/api/regularPosts?author=${encodeURIComponent(author)}`
    : `${API_URL}/api/regularPosts`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }

  const posts = await res.json();
  return posts;
}

export default function ProfileBlogLoop() {
  const [posts, setPosts] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const getPosts = async () => {
      try {
        const author = session?.user?.email;
        const postsData = await fetchPosts(author);

        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    if (session) {
      getPosts();
    }
  }, [session]);

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Your Blog Posts</h1>
        <p className="text-gray-500 mt-2">Manage and edit your authored blog posts here.</p>
      </header>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Featured Image */}
              {post.featured_image && (
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  height={300}
                  width={500}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}

              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">{post.title}</h2>
                <p className="text-gray-500 text-sm mb-4">
                  <span className="font-medium">Posted on:</span> {new Date(post.created_at).toLocaleDateString()}
                </p>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <Link
                    href={`/blog/${post.slug}`}
                    passHref
                    className="inline-block bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition"
                  >
                    Read More
                  </Link>
                  <Link
                    href={`/blog/edit/${post.id}`}
                    passHref
                    className="inline-block text-sky-500 border border-sky-500 px-4 py-2 rounded-lg hover:bg-sky-500 hover:text-white transition"
                  >
                    Edit Post
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center col-span-full">
            <p className="text-lg font-medium text-gray-500">You have no blog posts yet. Start creating one!</p>
            <Link
              href="/blog/create"
              className="mt-4 inline-block bg-sky-500 text-white px-6 py-3 rounded-lg hover:bg-sky-600 transition"
            >
              Create New Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
