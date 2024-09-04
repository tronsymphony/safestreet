'use client';
import React, { useState, useEffect } from 'react';
import styles from './edit.module.scss';
import Editor from '../../components/PostEditor';  // Assume Editor is in /components
import { useRouter } from 'next/router';

async function fetchPost(id) {
  const res = await fetch(`http://localhost:3000/api/getpostbyid?id=${id}`);

  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }

  const post = await res.json();
  return post;
}

export default function EditPostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);

  useEffect(() => {
    if (id) {
      const getPost = async () => {
        try {
          const post = await fetchPost(id);
          const blocks = JSON.parse(post.content);
          const postData = {
            time: new Date(post.updated_at).getTime(),
            blocks: [
              {
                type: 'header',
                data: {
                  text: post.title,
                  level: 1,
                },
              },
              ...blocks,
            ],
          };
          setData(postData);
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      };

      getPost();
    }
  }, [id]);

  const handleSave = async (postData) => {
    try {
      const titleBlock = postData.blocks.find(block => block.type === 'header');
      const contentBlocks = postData.blocks.filter(block => block.type !== 'header');

      const postContent = {
        title: titleBlock ? titleBlock.data.text : 'Untitled',
        content: JSON.stringify(contentBlocks),
        updated_at: new Date().toISOString(),
      };

      const response = await fetch(`/api/updatepost/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postContent),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Post updated successfully!', data);

      // Redirect or display a success message
    } catch (error) {
      console.error('Error updating post:', error);
      // Handle the error, maybe display a message to the user
    }
  };

  if (!data) {
    return (
      <div className={styles.loading}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <h2>Edit Post</h2>
      <Editor data={data} onChange={setData} editorblock="editorjs-container" />
      <button className="savebtn" onClick={() => handleSave(data)}>
        Save Changes
      </button>
    </main>
  );
}
