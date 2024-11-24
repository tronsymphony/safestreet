'use client';

import React, { useState, useEffect } from 'react';
import MapboxDrawComponent from "../../components/map-single-view";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

async function fetchPost(slug) {
  const res = await fetch(`/api/getpostbyslug?slug=${slug}`);
  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }
  return res.json();
}

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

async function fetchComments(pageId) {
  const res = await fetch(`/api/fetchcomment?page_id=${pageId}&page_type=post`);
  if (!res.ok) {
    console.error('Failed to fetch comments');
    return [];
  }
  return res.json();
}

export default function PostPage({ params }) {
  const { slug } = params;
  const [post, setPost] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const userSession = await getSession();
      if (!userSession) {
        router.push("/auth/signin");
      } else {
        setSession(userSession);
        try {
          const fetchedPost = await fetchPost(slug);
          setPost(fetchedPost);
          setLikeCount(fetchedPost.like_count || 0);
          console.log(fetchedPost);
          
          const fetchedComments = await fetchComments(fetchedPost.post_id);
          setComments(fetchedComments || []);
        } catch (err) {
          console.error(err);
          setError('Failed to load the post.');
        } finally {
          setLoading(false);
        }
      }
    };
    init();
  }, [router, slug]);

  const handleLikeToggle = async () => {
    if (!post?.route_id) return;
    try {
      const updatedData = await toggleLike(post.route_id, isLiked);
      setLikeCount(updatedData.like_count);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error(err);
      alert('Failed to toggle like.');
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      alert('Comment cannot be empty!');
      return;
    }
    try {
      const res = await fetch('/api/addcomment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_id: post.post_id, // Dynamic post ID
          page_type: 'post', // Specify the type
          author_id: session.id, // Use the logged-in user's ID
          author: session.user.email, // Use the logged-in user's name
          content: newComment,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to add comment');
      }

      const newCommentData = await res.json();
      setComments((prev) => [newCommentData, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error(err);
      alert('Failed to submit comment.');
    }
  };

  if (error) {
    return <div className="text-center mt-10">{error}</div>;
  }

  if (loading) {
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

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="mb-4 p-4 bg-gray-100 rounded-lg">
              <p className="font-bold">{comment.author}</p>
              <p className="text-gray-600">{new Date(comment.created_at).toLocaleString()}</p>
              <p className="mt-2">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Add a Comment</h3>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows="4"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleCommentSubmit}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
