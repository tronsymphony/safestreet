'use client'
import styles from "./page.module.scss";
import Editor from '../components/PostEditor';
import React, { useState } from "react";


export default function Home() {

    const INITIAL_DATA = {
        time: new Date().getTime(),
        blocks: [
          {
            type: "header",
            data: {
              text: "This is my awesome editor!",
              level: 1,
            },
          },
        ],
      };


      const handleSave = async (postData) => {
        try {
            // Extract title and content from postData
            const titleBlock = postData.blocks.find(block => block.type === 'header');
            const contentBlocks = postData.blocks.filter(block => block.type !== 'header');

            const postContent = {
                title: titleBlock ? titleBlock.data.text : 'Untitled',
                content: JSON.stringify(contentBlocks),
                created_at: new Date().toISOString(), // Adding created_at timestamp
                updated_at: new Date().toISOString(), // Adding updated_at timestamp
            };

            const response = await fetch('/api/saveposts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postContent),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Post saved successfully!', data);

            // Display a success message or update the UI accordingly
        } catch (error) {
            console.error('Error saving post:', error);
            // Handle the error, maybe display a message to the user
        }
    };

    const [data, setData] = useState(INITIAL_DATA);

    return (
        <main className={styles.main}>
            profiledd
            <h2>Create a New Post</h2>
            <Editor data={data} onChange={setData} editorblock="editorjs-container" />
      <button
        className="savebtn"
        onClick={() => handleSave(data)}
      >
        Save
      </button>

        </main>
    );
}
