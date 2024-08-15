import styles from "./page.module.css";
import React from 'react';
import Link from 'next/link';


async function fetchPosts() {
  const res = await fetch('http://localhost:3000/api/posts', {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  return res.json();
}

export default async function BlogPage() {
  const posts = await fetchPosts();
  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map((post) => {
        let content;

        // Check if content is JSON or HTML
        if (post.content.startsWith('[') || post.content.startsWith('{')) {
          try {
            // Parse JSON content
            const contentJson = JSON.parse(post.content);
            content = (
              <div>
                {contentJson.map((block) => {
                  if (block.type === 'paragraph') {
                    return <p key={block.id}>{block.data.text}</p>;
                  }
                  // Handle other block types if necessary
                  return null;
                })}
              </div>
            );
          } catch (error) {
            console.error('Failed to parse JSON content:', error);
            content = <p>Error parsing content.</p>;
          }
        } else {
          // Handle HTML content
          content = <div dangerouslySetInnerHTML={{ __html: post.content }} />;
        }

        return (
          <div key={post.id}>
            <Link href={`/posts/${post.id}`}>
                  {post.title}
              </Link>
            <div>
            {content}
            </div>
            <small>Posted on: {new Date(post.created_at).toLocaleDateString()}</small>
          </div>
        );
      })}
    </div>
  );
}
