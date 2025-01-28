'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Editor from '../../../components/Editor'; // Adjust the import path as needed

export default function EditPost() {
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        const res = await fetch(`/api/regularPosts?id=${encodeURIComponent(id)}`);
        if (res.ok) {
          const postData = await res.json();
          setPost(postData);
          setTitle(postData.title);
          setContent(postData.content);
          setFeaturedImage(postData.featured_image || '');
        } else {
          throw new Error('Failed to fetch post data');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setMessage('Failed to load post data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleImageChange = (e) => {
    setFeaturedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = featuredImage;

      // Upload new image if a file is provided
      if (featuredImage instanceof File) {
        const formData = new FormData();
        formData.append('file', featuredImage);

        const uploadRes = await fetch('/api/uploadImage', {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.filePath;
        } else {
          throw new Error('Image upload failed');
        }
      }

      // Update the post
      const updateRes = await fetch(`/api/regularPosts?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          featuredImage: imageUrl,
        }),
      });

      if (updateRes.ok) {
        setMessage('Post updated successfully');
        setTimeout(() => router.push('/profile'), 1500); // Redirect after a short delay
      } else {
        throw new Error('Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      setMessage('An error occurred while updating the post.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      const deleteRes = await fetch(`/api/regularPosts?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (deleteRes.ok) {
        setMessage('Post deleted successfully');
        router.push('/profile');
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setMessage('An error occurred while deleting the post.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-500">Post not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Post</h1>
      {message && <p className={`mb-4 ${message.includes('error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Content</label>
          <Editor initialData={content} onChange={setContent} />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Featured Image</label>
          {featuredImage && typeof featuredImage === 'string' && (
            <img
              src={featuredImage}
              alt="Featured"
              className="mb-4 rounded-lg w-full h-auto shadow"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Save Changes
        </button>
      </form>
      <button
        onClick={handleDelete}
        className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Delete Post
      </button>
    </div>
  );
}
