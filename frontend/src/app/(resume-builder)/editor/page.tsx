"use client";

import { useState, useEffect, useRef } from "react";
import { AccordionPanel } from "@/components/editor/AccordionPanel";
import Template1 from "@/templates/template-1/Template1";
import { useResumeStore } from "@/store/resumeStore";
import { useScaleToFit } from "@/hooks/useScaleToFit";
import { Download, ChevronDown, FileText, Loader2 } from "lucide-react";
import { exportAsDocx, exportAsPdf } from "@/lib/exportResume";

export default function EditorPage() {
  const rawResumeData = useResumeStore((state) => state.resumeData);
  const [debouncedData, setDebouncedData] = useState(rawResumeData);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce the preview update by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedData(rawResumeData);
    }, 300);
    return () => clearTimeout(timer);
  }, [rawResumeData]);

  // Handle click outside for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDownload = async (format: "docx" | "pdf") => {
    setIsDownloading(true);
    setShowDropdown(false);
    
    try {
      const filename = `Resume_${rawResumeData.personalInfo.fullName.replace(/\s+/g, '_') || "Export"}.${format}`;
      if (format === "docx") {
        await exportAsDocx(rawResumeData, filename);
      } else {
        await exportAsPdf(rawResumeData, filename);
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert(`Failed to export as ${format.toUpperCase()}`);
    } finally {
      setIsDownloading(false);
    }
  };

  // Use the scale hook (target 816px wide template, 64px padding)
  const { containerRef, scale } = useScaleToFit(816, 64);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-gray-900">
      {/* Header Bar */}
      <header className="flex-none h-14 px-6 border-b border-gray-200 flex items-center justify-between bg-white z-20 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-lg leading-none">
            R
          </div>
          <h1 className="text-lg font-semibold text-gray-800 tracking-tight">Resume Builder</h1>
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={isDownloading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            <span>Download</span>
            <ChevronDown size={14} className={`transition-transform ${showDropdown ? "rotate-180" : ""}`} />
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-30">
              <button 
                onClick={() => handleDownload("docx")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <FileText size={16} className="text-blue-600" />
                <span>Download as .docx</span>
              </button>
              <button 
                onClick={() => handleDownload("pdf")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <FileText size={16} className="text-red-500" />
                <span>Download as .pdf</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content: Two Panels */}
      <main className="flex-1 flex overflow-hidden z-10">
        {/* Left Panel: Editor */}
        <div className="w-[30%] h-full border-r border-gray-200 bg-white relative">
          <div className="absolute inset-0 overflow-y-auto">
            <AccordionPanel />
          </div>
        </div>

        {/* Right Panel: Preview */}
        <div 
          ref={containerRef} 
          className="w-[70%] h-full overflow-y-auto bg-gray-100 flex justify-center py-8 relative"
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
              <Template1 data={debouncedData} sectionOrder={useResumeStore((state) => state.sectionOrder)} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
