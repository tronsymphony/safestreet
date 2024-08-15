import React, { useRef, useEffect } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import ImageTool from '@editorjs/image';

const PostEditor = ({ onSave }) => {
  const editorInstance = useRef(null);

  useEffect(() => {
    // Initialize Editor.js
    editorInstance.current = new EditorJS({
      holder: 'editorjs',
      tools: {
        header: Header,
        list: List,
        paragraph: Paragraph,
        image: ImageTool,
      },
      autofocus: true,
    });

    // Cleanup function to destroy the editor instance
    return () => {
      if (editorInstance.current) {
        editorInstance.current.isReady
          .then(() => {
            editorInstance.current.destroy();
            editorInstance.current = null;
          })
          .catch((error) => console.error('ERROR during editor cleanup:', error));
      }
    };
  }, []);

  const handleSave = async () => {
    if (editorInstance.current) {
      const savedData = await editorInstance.current.save();
      onSave(savedData);
    }
  };

  return (
    <div>
      <div id="editorjs"></div>
      <button onClick={handleSave}>Save Post</button>
    </div>
  );
};

export default PostEditor;
