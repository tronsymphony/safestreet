'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { renderEditorContent } from '../../utils/renderEditorContent';
import Image from 'next/image';
// Fetch posts from the API by author if provided
async function fetchPosts(author) {
    const url = author ? `http://localhost:3000/api/regularPosts?author=${encodeURIComponent(author)}` : 'http://localhost:3000/api/regularPosts';

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

        getPosts();
    }, [session]);

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                        {post.featured_image && (
                            <Image
                            height="300"
                            width="200"
                                src={post.featured_image?post.featured_image:''}
                                alt={post.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                        )}

                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
                            <p className="text-gray-500 mb-4">Posted on: {new Date(post.created_at).toLocaleDateString()}</p>

                            <div className="flex justify-between">
                                <Link href={`/blog/${post.slug}`} passHref className="text-white bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-lg transition">
                                    Read More
                                </Link>
                                <Link href={`/blog/edit/${post.id}`} passHref className="text-slate-600 border border-slate-600 hover:bg-slate-600 hover:text-white px-4 py-2 rounded-lg transition">
                                    Edit Post
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
