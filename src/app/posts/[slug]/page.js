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

// Fetch comments for the post
async function fetchComments(postId) {
  const res = await fetch(`/api/comments/${postId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch comments');
  }

  const comments = await res.json();
  return comments.comments;
}

// Submit a new comment
async function submitComment(postId, author, content, author_id) {
  const res = await fetch(`/api/comments/${postId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author, content, author_id }),
  });

  if (!res.ok) {
    throw new Error('Failed to submit comment');
  }

  return res.json();
}

export default function PostPage({ params }) {
  const { slug } = params; // Use slug from params
  const [post, setPost] = useState(null); // State to store the post data
  const [error, setError] = useState(null); // State to manage errors
  const [comments, setComments] = useState([]); // State to store comments
  const [newComment, setNewComment] = useState(''); // State to manage new comment content
  const [author, setAuthor] = useState(''); // State to manage the comment author

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

  // Move getPost function inside useEffect to access slug properly
  useEffect(() => {
    const getPost = async () => {
      try {
        const fetchedPost = await fetchPost(slug); // Fetch post by slug
        setPost(fetchedPost); // Set post data in the state
        const fetchedComments = await fetchComments(fetchedPost.id); // Fetch comments for the post
        setComments(fetchedComments); // Set comments in the state
      } catch (err) {
        setError('Failed to fetch post');
        console.error('Error fetching post:', err);
      }
    };

    getPost(); // Call the function to fetch the post data
  }, [slug]); // Ensure this effect runs when `slug` changes

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!newComment || !author) {
      alert('Please provide both a name and a comment.');
      return;
    }

    try {
      const submittedComment = await submitComment(post.id, author, newComment);
      setComments([submittedComment.comment, ...comments]); // Add new comment to the top of the list
      setNewComment(''); // Reset comment field
      setAuthor(''); // Reset author field
    } catch (err) {
      alert('Failed to submit comment');
    }
  };

  // Handle the loading and error states
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
        <MapboxDrawComponent routeId={post.route_id} />
      </div>

      {/* Comments section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>

        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-sm">
              <p className="font-bold">{comment.author}</p>
              <p className="text-gray-500 text-sm">{new Date(comment.created_at).toLocaleString()}</p>
              <p className="mt-2">{comment.content}</p>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>

      {/* Comment form only loads when session is present */}
      {session && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Add a Comment</h2>
          <input
            type="text"
            placeholder="Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <textarea
            placeholder="Comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            rows="4"
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Submit Comment
          </button>
        </div>
      )}
    </div>
  );
}
