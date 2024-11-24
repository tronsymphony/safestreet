// components/Editor.js
import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';

const Editor = ({ onChange, initialData }) => {
    const editorInstance = useRef(null);

    useEffect(() => {
        if (!editorInstance.current) {
            // Initialize Editor.js
            editorInstance.current = new EditorJS({
                holder: 'editorjs',
                tools: {
                    header: Header,
                    paragraph: Paragraph,
                },
                data: initialData || {}, // Load any initial data
                onChange: async () => {
                    const content = await editorInstance.current.save();
                    onChange(content); // Pass content data back to the parent component
                },
                placeholder: 'Write your content here...',
            });
        }

        return () => {
            if (editorInstance.current) {
                // editorInstance.current.destroy().catch((error) => 
                //     console.error('Error destroying editor instance:', error)
                // );
                // editorInstance.current = null;
            }
        };
    }, [initialData, onChange]);

    return <div id="editorjs" className="bg-gray-50 border border-gray-200 rounded-lg p-2"></div>;
};

export default Editor;
