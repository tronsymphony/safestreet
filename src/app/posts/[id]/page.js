import React from 'react';

async function fetchPost(id) {
  const res = await fetch(`http://localhost:3000/api/getpostbyid?id=${id}`);
  
  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }

  const post = await res.json();
  return post;
}

export default async function PostPage({ params }) {
  const { id } = params;

  let post;

  try {
    post = await fetchPost(id);
  } catch (error) {
    console.error('Error fetching post:', error);
    return (
      <div>
        <h1>Error</h1>
        <p>Could not fetch the post. Please try again later.</p>
      </div>
    );
  }

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
    <div>
      <h1>{post.title}</h1>
      {content}
      <small>Posted on: {new Date(post.created_at).toLocaleDateString()}</small>
    </div>
  );
}
