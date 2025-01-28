'use client';

import React, { useState, useEffect } from 'react';
import MapboxDrawComponent from "../../../components/map-single-view";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Fetch post by id
async function fetchPostById(id) {
  const res = await fetch(`/api/getpostbyid?id=${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }
  return res.json();
}

// Fetch comments for the post
async function fetchComments(postId) {
  const res = await fetch(`/api/comments/${postId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch comments');
  }
  return res.json().comments;
}



// Delete post
async function deletePostById(id) {
  const res = await fetch(`/api/deleteroute?id=${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete post');
  }

  return res.json();
}

export default function PostPage({ params }) {
  const { id } = params; // Use id from params
  const [post, setPost] = useState(null); // State to store the post data
  const [error, setError] = useState(null); // State to manage errors
  const [comments, setComments] = useState([]); // State to store comments
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for initial data fetch
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        router.push("/auth/signin");
      } else {
        setSession(session);
        setLoading(false); // Loading finished once session is retrieved
      }
    });
  }, [router]);

  useEffect(() => {
    const getPost = async () => {
      try {
        const fetchedPost = await fetchPostById(id); // Fetch post by id
        setPost(fetchedPost); // Set post data in the state
        // const fetchedComments = await fetchComments(fetchedPost.id); // Fetch comments for the post
        // setComments(fetchedComments); // Set comments in the state
      } catch (err) {
        setError('Failed to fetch post');
        console.error('Error fetching post:', err);
      }
    };

    getPost(); // Call the function to fetch the post data
  }, [id]); // Ensure this effect runs when `id` changes

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete the post "${post.title}"? This action cannot be undone.`)) {
      return;
    }
  
    try {
      setLoading(true); // Show loader during deletion
      await deletePostById(id); // Delete the post
      alert('Post deleted successfully!');
      router.push('/profile'); // Redirect to the post listing page
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete the post. Please try again.');
    } finally {
      setLoading(false); // Hide loader after completion
    }
  };

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
    <div className="container mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-600">Posted on: {new Date(post.created_at).toLocaleDateString()}</p>
        <div className="mt-4" dangerouslySetInnerHTML={{ __html: post.content }} />
        {/* Mapbox component to show the route */}
        <MapboxDrawComponent post={post} />
      </div>

      {/* Delete Button */}
      <div className="mt-10 text-right">
        <button
          onClick={()=>handleDelete(post.id)}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
        >
          Delete Route
        </button>
      </div>
    </div>
  );
}
