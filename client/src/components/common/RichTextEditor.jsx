import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link, Quote, Undo, Redo } from 'lucide-react';

const RichTextEditor = ({
  value = '',
  onChange,
  label,
  placeholder = 'Write content here...',
  className = '',
  required = false,
}) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      // Only update if fundamentally different to prevent cursor jumping
      if (editorRef.current.innerHTML === '' || value === '') {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const formatDoc = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const addLink = () => {
    const url = prompt('Enter the link URL (e.g. https://...):');
    if (url) {
      formatDoc('createLink', url);
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="border border-slate-300 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-primary-700/20 focus-within:border-primary-700 transition-all shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 text-slate-700">
          <button
            type="button"
            onClick={() => formatDoc('bold')}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatDoc('italic')}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-300 mx-1" />
          <button
            type="button"
            onClick={() => formatDoc('formatBlock', '<h2>')}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition font-bold text-xs"
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatDoc('formatBlock', '<h3>')}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition font-bold text-xs"
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatDoc('formatBlock', '<p>')}
            className="px-2 py-1 hover:bg-slate-200 rounded text-slate-700 transition text-xs font-medium"
            title="Paragraph"
          >
            P
          </button>
          <div className="w-px h-4 bg-slate-300 mx-1" />
          <button
            type="button"
            onClick={() => formatDoc('insertUnorderedList')}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatDoc('insertOrderedList')}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatDoc('formatBlock', '<blockquote>')}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-300 mx-1" />
          <button
            type="button"
            onClick={addLink}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
            title="Insert Link"
          >
            <Link className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-300 mx-1" />
          <button
            type="button"
            onClick={() => formatDoc('undo')}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatDoc('redo')}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Editable Area */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          placeholder={placeholder}
          className="min-h-[160px] max-h-[400px] overflow-y-auto p-4 text-sm text-slate-800 focus:outline-none prose-content"
          style={{ minHeight: '180px' }}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
