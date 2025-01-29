// app/post-editor/page.js
import dynamic from 'next/dynamic';

const PostEditor = dynamic(() => import('../../components/PostEditor'), {
  ssr: false, // Disable SSR for this component
});

export default function PostEditorPage() {
  return (
    <div>
      <PostEditor />
    </div>
  );
}
