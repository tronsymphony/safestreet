"use client";

import React, { useState, useEffect } from "react";
import MapboxDrawComponent from "../../components/map-single-view";
import { getSession } from "next-auth/react";
import Image from "next/image";

async function fetchPost(slug, userId = null) { // ✅ Default value added
  const res = await fetch(`/api/getpostbyslug?slug=${slug}&user_id=${userId}`);
  
  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }
  return res.json();
}

async function toggleLike(routeId, isLiked, userId) {
  console.log(routeId, isLiked, userId);
  
  const res = await fetch(`/api/toggleLike`, {
    method: isLiked ? "DELETE" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ route_id: routeId, user_id: userId }),
  });

  if (!res.ok) {
    throw new Error("Failed to toggle like");
  }
  return res.json();
}

async function fetchComments(postId) {
  const res = await fetch(`/api/fetchcomment?page_id=${postId}&page_type=post`);
  if (!res.ok) {
    console.error("Failed to fetch comments");
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
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);

  
  useEffect(() => {
    const init = async () => {
      const userSession = await getSession();
      setSession(userSession || null);
  
      try {
        const fetchedPost = await fetchPost(slug, userSession?.user?.id || null); // ✅ Pass null if not logged in
        setPost(fetchedPost);
        setLikeCount(fetchedPost.like_count || 0);
        setIsLiked(fetchedPost.user_has_liked || false);
        const fetchedComments = await fetchComments(fetchedPost.post_id);
        setComments(fetchedComments || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load the post.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [slug]);
  

  const handleLikeToggle = async () => {
    if (!session) {
      alert("You must be logged in to like this post.");
      return;
    }
  
    if (!post?.route_id) return;
  
    try {
      const updatedData = await toggleLike(post.route_id, isLiked, session.user.id); // ✅ Fix user ID
      setLikeCount(updatedData.like_count);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error(err);
      alert("Failed to toggle like.");
    }
  };
  

  const handleCommentSubmit = async () => {
    if (!session) {
      alert("You must be logged in to submit a comment.");
      return;
    }
  
    if (!newComment.trim()) {
      alert("Comment cannot be empty!");
      return;
    }
  
    try {
      const res = await fetch("/api/addcomment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_id: post.post_id, // ✅ Ensure this is correct
          page_type: "post",
          author_id: session.user.id, // ✅ Fix user ID retrieval
          author: session.user.email,
          content: newComment,
        }),
      });
  
      if (!res.ok) {
        throw new Error("Failed to add comment");
      }
  
      const newCommentData = await res.json();
      setComments((prev) => [newCommentData, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert("Failed to submit comment.");
    }
  };
  

  if (error) {
    return <div className="text-center mt-10">{error}</div>;
  }

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }
  
  if (!slug) return <div className="text-center mt-10">Invalid post.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 pb-4">
      <div className="mb-8 grid grid-cols-2 gap-2">
        <div className="block bg-gray-100 p-4 rounded-md shadow-sm">
          {post.featured_image && (
            <Image
              src={post.featured_image}
              alt={"featured image"}
              width={200}
              height={200}
            ></Image>
          )}

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div>City: {post.route_city}</div>
          <div>Condition: {post.route_condition}</div>
          <p className="text-gray-600">
            Posted on: {new Date(post.created_at).toLocaleDateString()}
          </p>
          <div className="py-2">
            Description:
            <div
              className=""
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
          <div className="my-4">
            <button
              onClick={handleLikeToggle}
              className={`hover:bg-white hover:text-black px-6 py-2 text-sm capitalize font-semibold ${
                isLiked ? "bg-red-500" : "bg-blue-500"
              } text-white rounded-full transition`}
            >
              {isLiked ? "Unlike" : "Like"} ({likeCount})
            </button>
          </div>
        </div>

        <MapboxDrawComponent post={post} />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="mb-4 p-4 bg-gray-100 rounded-lg">
              <p className="font-bold">{comment.author}</p>
              <p className="text-gray-600">
                {new Date(comment.created_at).toLocaleString()}
              </p>
              <p className="mt-2">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>

      {session && (
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
      )}
    </div>
  );
}
