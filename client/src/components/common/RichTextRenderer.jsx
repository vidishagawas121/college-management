import React from 'react';

const RichTextRenderer = ({ content, className = '' }) => {
  if (!content) return null;

  return (
    <div
      className={`prose-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichTextRenderer;
