'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Pilcrow,
  Minus,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const ToolbarButton = ({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`p-1.5 rounded transition-colors ${
      active
        ? 'bg-brand-red text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    {children}
  </button>
);

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write detailed product description here...',
  minHeight = '200px',
}: RichTextEditorProps) {
  const isInternalUpdate = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class: 'outline-none',
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      isInternalUpdate.current = true;
      // Treat empty paragraph as empty string
      onChange(html === '<p></p>' ? '' : html);
      // Reset after a tick to allow for state updates
      setTimeout(() => {
        isInternalUpdate.current = false;
      }, 0);
    },
  });

  // Sync value when it changes externally (e.g., on data load)
  useEffect(() => {
    if (!editor || isInternalUpdate.current) return;

    const current = editor.getHTML();
    // Only update if the value is truly different and not just a paragraph wrapper difference
    const sanitizedValue = value || '';
    const normalizedValue = sanitizedValue === '' ? '<p></p>' : sanitizedValue;
    const normalizedCurrent = current === '' ? '<p></p>' : current;

    if (normalizedValue !== normalizedCurrent) {
      editor.commands.setContent(sanitizedValue, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-brand-red/30 focus-within:border-brand-red transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
        <ToolbarButton
          title="Paragraph"
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive('paragraph')}
        >
          <Pilcrow size={15} />
        </ToolbarButton>

        <ToolbarButton
          title="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 size={15} />
        </ToolbarButton>

        <ToolbarButton
          title="Heading 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
        >
          <Heading3 size={15} />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          <Bold size={15} />
        </ToolbarButton>

        <ToolbarButton
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          <Italic size={15} />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          <List size={15} />
        </ToolbarButton>

        <ToolbarButton
          title="Ordered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          <ListOrdered size={15} />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          title="Horizontal Rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={15} />
        </ToolbarButton>
      </div>

      {/* Editor Content */}
      <div className="relative">
        {editor.isEmpty && (
          <p className="absolute top-3 left-3 text-gray-400 text-sm pointer-events-none select-none">
            {placeholder}
          </p>
        )}
        <EditorContent
          editor={editor}
          style={{ minHeight }}
          className="
            px-3 py-3 text-sm text-gray-800 cursor-text
            [&_.tiptap]:outline-none
            [&_.tiptap]:min-h-[inherit]
            [&_.tiptap_h2]:text-lg [&_.tiptap_h2]:font-bold [&_.tiptap_h2]:mb-1 [&_.tiptap_h2]:mt-3
            [&_.tiptap_h3]:text-base [&_.tiptap_h3]:font-semibold [&_.tiptap_h3]:mb-1 [&_.tiptap_h3]:mt-2
            [&_.tiptap_p]:mb-2
            [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-5 [&_.tiptap_ul]:mb-2
            [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-5 [&_.tiptap_ol]:mb-2
            [&_.tiptap_li]:mb-0.5
            [&_.tiptap_strong]:font-bold
            [&_.tiptap_em]:italic
            [&_.tiptap_hr]:border-gray-200 [&_.tiptap_hr]:my-3
          "
        />
      </div>
    </div>
  );
}
