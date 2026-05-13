"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { useResumeStore } from "@/store/resumeStore";
import { AccordionPanel } from "@/components/editor/AccordionPanel";
import Template1 from "@/templates/template-1";
import { useScaleToFit } from "@/hooks/useScaleToFit";
import { exportAsDocx, exportAsPdf } from "@/lib/exportResume";
import type { ResumeData } from "@/types/resume";

export default function EditorPage() {
  const resumeData = useResumeStore((state) => state.resumeData);
  const sectionOrder = useResumeStore((state) => state.sectionOrder);
  const [debouncedData, setDebouncedData] = useState<ResumeData>(resumeData);
  const [isExporting, setIsExporting] = useState<"docx" | "pdf" | null>(null);
  const { containerRef, scale } = useScaleToFit();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedData(resumeData), 300);
    return () => clearTimeout(timer);
  }, [resumeData]);

  const handleExportDocx = async (): Promise<void> => {
    setIsExporting("docx");
    try {
      await exportAsDocx(resumeData, "resume.docx");
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportPdf = async (): Promise<void> => {
    setIsExporting("pdf");
    try {
      await exportAsPdf(resumeData, "resume.pdf");
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Left — Editor Panel */}
      <div className="w-[420px] flex-shrink-0 flex flex-col border-r border-gray-200 bg-gray-50 overflow-hidden">
        {/* Sticky header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Link
              href="/templates"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Back to templates"
            >
              <ArrowLeft size={18} />
            </Link>
            <span className="text-sm font-semibold text-gray-800">Resume Editor</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportDocx}
              disabled={isExporting !== null}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-[#0a192f] text-white rounded-md hover:bg-[#162b4a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download size={13} />
              {isExporting === "docx" ? "Exporting…" : "DOCX"}
            </button>
            <button
              onClick={handleExportPdf}
              disabled={isExporting !== null}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 border border-[#0a192f] text-[#0a192f] rounded-md hover:bg-[#0a192f]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download size={13} />
              {isExporting === "pdf" ? "Exporting…" : "PDF"}
            </button>
          </div>
        </div>

        {/* Scrollable form area */}
        <div className="flex-1 overflow-y-auto">
          <AccordionPanel />
        </div>
      </div>

      {/* Right — Live Preview */}
      <div ref={containerRef} className="flex-1 overflow-y-auto bg-gray-100">
        <div className="flex justify-center p-8">
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top center",
              width: 816,
              flexShrink: 0,
            }}
          >
            <Template1 data={debouncedData} sectionOrder={sectionOrder} />
          </div>
        </div>
      </div>
    </div>
  );
}
