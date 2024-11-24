'use client';
import React, { useState, useEffect } from 'react';
import MapboxDrawComponent from "../../components/map-single-view";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Fetch post by slug
async function fetchPost(slug) {
  const res = await fetch(`/api/getpostbyslug?slug=${slug}`);

  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }

  const post = await res.json();
  return post;
}


// Like or unlike a route
async function toggleLike(routeId, isLiked) {
  const res = await fetch(`/api/toggleLike`, {
    method: isLiked ? 'DELETE' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ route_id: routeId }),
  });

  if (!res.ok) {
    throw new Error('Failed to toggle like');
  }

  return res.json();
}

export default function PostPage({ params }) {
  const { slug } = params;
  const [post, setPost] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        router.push("/auth/signin");
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  useEffect(() => {
    const getPost = async () => {
      try {
        const fetchedPost = await fetchPost(slug);
        setPost(fetchedPost);

        if (fetchedPost.route_id) {
          setLikeCount(fetchedPost.like_count);
          // setIsLiked(post.is_liked); // Assume the API returns whether the user liked this route
        }
      } catch (err) {
        setError('Failed to fetch post');
        console.error('Error fetching post:', err);
      }
    };

    getPost();
  }, [slug]);

  const handleLikeToggle = async () => {
    if (!post.route_id) return;

    try {
      const updatedData = await toggleLike(post.route_id, isLiked);
      setLikeCount(updatedData.like_count);
      // setIsLiked(!isLiked);
    } catch (err) {
      console.error('Error toggling like:', err);
      alert('Failed to toggle like. Please try again.');
    }
  };

  if (error) {
    return <div className="text-center mt-10">{error}</div>;
  }

  if (!post || loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-600">Posted on: {new Date(post.created_at).toLocaleDateString()}</p>
        
        <div className="mt-4" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="my-4">
          <button
            onClick={handleLikeToggle}
            className={`px-4 py-2 rounded-lg ${isLiked ? 'bg-red-500' : 'bg-blue-500'} text-white`}
          >
            {isLiked ? 'Unlike' : 'Like'} ({likeCount})
          </button>
        </div>

        <MapboxDrawComponent post={post} />
      </div>


    </div>
  );
}
