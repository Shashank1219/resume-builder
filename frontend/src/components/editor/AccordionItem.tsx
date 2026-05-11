import { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronDown, ChevronUp } from "lucide-react";

interface AccordionItemProps {
  id: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function AccordionItem({
  id,
  title,
  isOpen,
  onToggle,
  children,
}: AccordionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-4 border border-gray-200 rounded-md bg-white shadow-sm overflow-hidden"
    >
      <div
        className="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200 cursor-pointer select-none"
        onClick={onToggle}
      >
        <button
          {...attributes}
          {...listeners}
          className="mr-3 cursor-grab text-gray-400 hover:text-gray-600 focus:outline-none"
          onClick={(e) => e.stopPropagation()} // Prevent accordion toggle when interacting with handle
        >
          <GripVertical size={20} />
        </button>
        <span className="flex-1 font-medium text-gray-800">{title}</span>
        <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      {isOpen && <div className="p-4 bg-white">{children}</div>}
    </div>
  );
}
