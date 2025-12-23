import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button, Space } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import './index.scss';

interface TiptapEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Enter text...',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap-editor">
      <div className="toolbar">
        <Space size="small">
          <Button
            size="small"
            icon={<BoldOutlined />}
            onClick={() => editor.chain().focus().toggleBold().run()}
            type={editor.isActive('bold') ? 'primary' : 'default'}
            title="Bold (Ctrl+B)"
          />
          <Button
            size="small"
            icon={<ItalicOutlined />}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            type={editor.isActive('italic') ? 'primary' : 'default'}
            title="Italic (Ctrl+I)"
          />
          <Button
            size="small"
            icon={<UnorderedListOutlined />}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            type={editor.isActive('bulletList') ? 'primary' : 'default'}
            title="Bullet List"
          />
          <Button
            size="small"
            icon={<OrderedListOutlined />}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            type={editor.isActive('orderedList') ? 'primary' : 'default'}
            title="Numbered List"
          />
        </Space>
      </div>
      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
};
