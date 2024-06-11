'use client'
// components/PostEditor.js
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import react-quill to prevent SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const toolbarOptions = [
    [{ font: [] }],
    [{ align: [] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ color: [] }, { background: [] }],
    ['link', 'image'],
    ['clean'],
];

// handle upload image and insert to editor
// const handleUploadImage = async () => {
//     const quill = quillRef.current?.getEditor();

//     if (quill) {
//         const input = document.createElement('input');
//         input.setAttribute('type', 'file');
//         input.click();

//         input.onchange = async () => {
//             const file = input.files[0];
//             if (/^image\//.test(file.type)) {
//                 const res = await ...yourImageApi
//                 const range = quill.getSelection(true);
//                 if (range) {
//                     quill.insertEmbed(range.index, 'image', res.data[0].url);
//                 } else {
//                     quill.clipboard.dangerouslyPasteHTML(
//                         quill.getLength(),
//                         `<img src="${res.data[0].url}" alt=""/>`
//                     );
//                 }
//             }
//         };
//     }
// };

const PostEditor = () => {
    const [title,setTitle] = useState('');
    const [content, setContent] = useState('');

    const savePost = async () => {
        const response = await fetch('http://localhost:3001/api/saveposts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content }),
        });

        if (response.ok) {
            console.log('Post created successfully');
            // Optionally, clear the form or redirect to another page
        } else {
            console.error('Failed to create post');
        }
    };


    const module = useMemo(
        () => ({
            toolbar: {
                container: toolbarOptions,
                handlers: {
                    // image: handleUploadImage,
                },
            },
        }),
        []
    );
    return (
        <div className='container'>
            <header><h1>Create a New Post</h1></header>
            <ReactQuill
                theme='snow'
                value={title} onChange={setTitle} />

            <ReactQuill
                modules={module}
                theme='snow'
                value={content} onChange={setContent} />

            <button
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#0070f3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
                onClick={savePost}
            >
                Save Post
            </button>
        </div>
    );
};

export default PostEditor;
