"use client"; // Explicitly make this a Client Component
import dynamic from 'next/dynamic';

const PostEditor = dynamic(() => import('../../components/PostEditor'), {ssr: false});

export default function PostEditorPage() {
  return (
    <div>
      <PostEditor />
    </div>
  );
}
