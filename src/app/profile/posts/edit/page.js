'use client';
import { useState, useEffect } from 'react';
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Editor from '../../../components/Editor';

export default function CreateRegularPost() {
    const [title, setTitle] = useState('');
    const [featuredImage, setFeaturedImage] = useState(null); // Updated to handle file uploads
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading state for submission
    const [session, setSession] = useState(null);
    const router = useRouter();

    useEffect(() => {
        getSession().then((session) => {
            if (!session) {
                router.push("/auth/signin");
            } else {
                setSession(session);
                setAuthor(session.user.email);
            }
        });
    }, [router]);

    if (!session) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    // Handle featured image file upload
    const handleFeaturedImageChange = (e) => {
        setFeaturedImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let imageUrl = '';

        if (featuredImage) {
            const formData = new FormData();
            formData.append('file', featuredImage);

            const uploadRes = await fetch('/api/uploadImage', {
                method: 'POST',
                body: formData,
            });
            
            const uploadData = await uploadRes.json();

            if (uploadRes.ok) {
                imageUrl = uploadData.filePath;
            } else {
                setMessage('Image upload failed');
                setLoading(false);
                return;
            }
        }

        try {
            const response = await fetch('/api/regularPosts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, featuredImage: imageUrl, author }),
            });

            if (response.ok) {
                const result = await response.json();
                setMessage(`Post created successfully: ${result.title}`);
                setTitle('');
                setFeaturedImage(null);
                setContent('');
            } else {
                const error = await response.json();
                setMessage(error.error || 'Failed to create post');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Post</h1>
            {message && <p className="text-center text-green-500 mb-4">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Title</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Content</label>
                    <Editor onChange={setContent} initialData={content} />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Featured Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFeaturedImageChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <button
                    type="submit"
                    className={`w-full py-2 ${loading ? 'bg-gray-500' : 'bg-blue-600'} text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    disabled={loading}
                >
                    {loading ? 'Creating Post...' : 'Create Post'}
                </button>
            </form>
        </div>
    );
}
