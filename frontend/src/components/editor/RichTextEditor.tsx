import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Bold, Italic, Underline as UnderlineIcon, List } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[120px] p-3",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 bg-white">
      <div className="flex items-center space-x-1 border-b bg-gray-50 p-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors ${
            editor.isActive("bold") ? "bg-gray-200 text-blue-600" : "text-gray-700"
          }`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors ${
            editor.isActive("italic") ? "bg-gray-200 text-blue-600" : "text-gray-700"
          }`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors ${
            editor.isActive("underline") ? "bg-gray-200 text-blue-600" : "text-gray-700"
          }`}
          title="Underline"
        >
          <UnderlineIcon size={16} />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors ${
            editor.isActive("bulletList") ? "bg-gray-200 text-blue-600" : "text-gray-700"
          }`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
