"use client";

import { useState, useEffect } from "react";
import { AccordionPanel } from "@/components/editor/AccordionPanel";
import Template1 from "@/templates/template-1/Template1";
import { useResumeStore } from "@/store/resumeStore";
import { useScaleToFit } from "@/hooks/useScaleToFit";
import { Download } from "lucide-react";

export default function EditorPage() {
  const rawResumeData = useResumeStore((state) => state.resumeData);
  const [debouncedData, setDebouncedData] = useState(rawResumeData);

  // Debounce the preview update by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedData(rawResumeData);
    }, 300);
    return () => clearTimeout(timer);
  }, [rawResumeData]);

  // Use the scale hook (target 816px wide template, 64px padding)
  const { containerRef, scale } = useScaleToFit(816, 64);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-gray-900">
      {/* Header Bar */}
      <header className="flex-none h-14 px-6 border-b border-gray-200 flex items-center justify-between bg-white z-10 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-lg leading-none">
            R
          </div>
          <h1 className="text-lg font-semibold text-gray-800 tracking-tight">Resume Builder</h1>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
          <Download size={16} />
          <span>Download</span>
        </button>
      </header>

      {/* Main Content: Two Panels */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Editor */}
        <div className="w-1/2 h-full border-r border-gray-200 bg-white relative">
          <AccordionPanel />
        </div>

        {/* Right Panel: Preview */}
        <div 
          ref={containerRef} 
          className="w-1/2 h-full overflow-y-auto bg-gray-100 flex justify-center py-8 relative"
        >
          {/* Scaled Wrapper */}
          <div 
            className="origin-top flex justify-center h-max transition-transform duration-100 ease-out"
            style={{ 
              transform: `scale(${scale})`, 
              width: "816px",
              // To prevent excessive bottom whitespace after scaling down
              marginBottom: scale < 1 ? `-${(1 - scale) * 100}%` : "0"
            }}
          >
            <div className="shadow-2xl rounded-sm overflow-hidden bg-white ring-1 ring-gray-900/5">
              <Template1 data={debouncedData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
