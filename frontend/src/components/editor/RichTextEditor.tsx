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
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[120px] max-h-[300px] overflow-y-auto p-3",
      },
    },
  });

  if (!editor) {
    return null;
  }

  // Use onMouseDown + preventDefault to keep editor focus when clicking toolbar buttons
  const handleToolbarMouseDown = (e: React.MouseEvent, command: () => void) => {
    e.preventDefault(); // Prevent editor losing focus
    command();
  };

  return (
    <div className="flex flex-col border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 bg-white">
      {/* Toolbar */}
      <div className="flex items-center space-x-1 border-b bg-gray-50 p-2">
        <button
          type="button"
          onMouseDown={(e) => handleToolbarMouseDown(e, () => editor.chain().focus().toggleBold().run())}
          className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors ${
            editor.isActive("bold") ? "bg-gray-200 text-blue-600" : "text-gray-700"
          }`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleToolbarMouseDown(e, () => editor.chain().focus().toggleItalic().run())}
          className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors ${
            editor.isActive("italic") ? "bg-gray-200 text-blue-600" : "text-gray-700"
          }`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleToolbarMouseDown(e, () => editor.chain().focus().toggleUnderline().run())}
          className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors ${
            editor.isActive("underline") ? "bg-gray-200 text-blue-600" : "text-gray-700"
          }`}
          title="Underline"
        >
          <UnderlineIcon size={16} />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button
          type="button"
          onMouseDown={(e) => handleToolbarMouseDown(e, () => editor.chain().focus().toggleBulletList().run())}
          className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors ${
            editor.isActive("bulletList") ? "bg-gray-200 text-blue-600" : "text-gray-700"
          }`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
      </div>

      {/* Editor content — styles applied inline so Tailwind reset doesn't kill them */}
      <style>{`
        .tiptap-editor ul { list-style-type: disc; padding-left: 1.5rem; margin: 0.25rem 0; }
        .tiptap-editor ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0.25rem 0; }
        .tiptap-editor li { margin: 0.1rem 0; }
        .tiptap-editor p { margin: 0.2rem 0; }
        .tiptap-editor strong { font-weight: 700; }
        .tiptap-editor em { font-style: italic; }
        .tiptap-editor u { text-decoration: underline; }
      `}</style>
      <div className="tiptap-editor text-sm">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
