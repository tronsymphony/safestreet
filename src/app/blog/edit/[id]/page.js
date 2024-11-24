'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // App Router hooks
import Editor from '../../../components/Editor'; // Adjust the import path as needed

export default function EditPost() {
    const [post, setPost] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [featuredImage, setFeaturedImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const router = useRouter();
    const params = useParams(); // Access route parameters
    const id = params.id; // Extract the id

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
                router.push('/profile'); // Redirect to profile or listing page
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
                router.push('/profile'); // Redirect to profile or listing page
            } else {
                throw new Error('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            setMessage('An error occurred while deleting the post.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!post) {
        return <div>Post not found.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
            {message && <p className="text-green-500 mb-4">{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="block text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Content</label>
                    <Editor initialData={content} onChange={setContent} />
                </div>
                <div>
                    <label className="block text-gray-700">Featured Image</label>
                    {featuredImage && typeof featuredImage === 'string' && (
                        <img
                            src={featuredImage}
                            alt="Featured"
                            className="mb-4 rounded-lg w-full h-auto"
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
                    className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                    Save Changes
                </button>
            </form>
            <button
                onClick={handleDelete}
                className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
            >
                Delete Post
            </button>
        </div>
    );
}
