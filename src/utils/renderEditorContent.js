export function renderEditorContent(content) {
  // Directly check and log to confirm the content structure
  if (!content || !content.blocks) {
    console.warn("Content or blocks is missing:", content);
    return <p>No content available to display.</p>; // Fallback message
  }

  return content.blocks.map((block, index) => {
    switch (block.type) {
      case 'header':
        return <h2 key={index} className="text-2xl font-bold mb-4">{block.data.text}</h2>;
      case 'paragraph':
        return <p key={index} className="text-gray-700 mb-4">{block.data.text}</p>;
      case 'image':
        return (
          <div key={index} className="mb-4">
            <img src={block.data.file.url} alt={block.data.caption || 'Image'} className="w-full h-auto rounded-lg" />
            {block.data.caption && <p className="text-sm text-gray-500">{block.data.caption}</p>}
          </div>
        );
      default:
        console.warn("Unknown block type:", block.type);
        return null;
    }
  });
}
