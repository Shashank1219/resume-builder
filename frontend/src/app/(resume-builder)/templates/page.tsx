"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Template1 from "@/templates/template-1/Template1";
import { sampleResumeData } from "@/templates/template-1/sampleData";
import { useResumeStore } from "@/store/resumeStore";

const emptyResumeData = {
  personalInfo: { fullName: "", linkedinUrl: "", phone: "", city: "", country: "", email: "" },
  profile: { summaryText: "" },
  skills: [],
  experience: [],
  education: [],
  projects: [],
  languages: [],
  certifications: [],
};

export default function TemplatesPage() {
  const router = useRouter();

  const handleSelectTemplate = () => {
    // Initialise store with empty ResumeData on fresh selection
    useResumeStore.setState({ 
      resumeData: emptyResumeData,
      selectedTemplate: "template-1"
    });
    router.push("/editor");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      {/* Header */}
      <header className="flex-none h-16 px-8 border-b border-gray-200 flex items-center justify-between bg-white z-10 shadow-sm">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#0a192f] rounded-md flex items-center justify-center text-white font-bold text-lg leading-none">
            R
          </div>
          <h1 className="text-lg font-semibold text-[#0a192f] tracking-tight">Resume Builder</h1>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 max-w-7xl mx-auto w-full">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold text-[#0a192f] mb-4">Choose Your Template</h2>
          <p className="text-lg text-gray-600">Select a professional template to get started.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Template 1 (Real) */}
          <div 
            onClick={handleSelectTemplate}
            className="group cursor-pointer flex flex-col bg-white rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#0a192f] transition-all duration-300 shadow-md hover:shadow-2xl"
          >
            <div className="relative h-[400px] bg-gray-200 overflow-hidden flex justify-center pt-8">
              {/* Scaled down thumbnail */}
              <div 
                className="origin-top shadow-lg bg-white pointer-events-none"
                style={{ 
                  transform: "scale(0.35)", 
                  width: "816px",
                  height: "1154px" // standard A4 height
                }}
              >
                <Template1 data={sampleResumeData} />
              </div>
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-[#0a192f]/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
                <span className="bg-[#0a192f] text-white px-6 py-2 rounded-full font-medium shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  Select Template
                </span>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-white">
              <h3 className="text-xl font-bold text-[#0a192f]">Template 1</h3>
              <p className="text-sm text-gray-500 mt-1">Clean, modern, ATS-friendly</p>
            </div>
          </div>

          {/* Template 2 (Placeholder) */}
          <div className="flex flex-col bg-white rounded-2xl overflow-hidden border-2 border-gray-200 opacity-60 cursor-not-allowed shadow-sm">
            <div className="h-[400px] bg-gray-100 flex flex-col items-center justify-center relative">
              <div className="absolute top-4 right-4 bg-gray-300 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Coming Soon
              </div>
              <div className="w-16 h-16 border-4 border-gray-300 rounded-full flex items-center justify-center mb-4">
                <span className="text-gray-400 font-bold text-2xl">2</span>
              </div>
              <p className="text-gray-400 font-medium">Creative Template</p>
            </div>
            <div className="p-6 border-t border-gray-100 bg-white">
              <h3 className="text-xl font-bold text-gray-400">Template 2</h3>
              <p className="text-sm text-gray-400 mt-1">Stand out with a creative layout</p>
            </div>
          </div>

          {/* Template 3 (Placeholder) */}
          <div className="flex flex-col bg-white rounded-2xl overflow-hidden border-2 border-gray-200 opacity-60 cursor-not-allowed shadow-sm">
            <div className="h-[400px] bg-gray-100 flex flex-col items-center justify-center relative">
              <div className="absolute top-4 right-4 bg-gray-300 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Coming Soon
              </div>
              <div className="w-16 h-16 border-4 border-gray-300 rounded-full flex items-center justify-center mb-4">
                <span className="text-gray-400 font-bold text-2xl">3</span>
              </div>
              <p className="text-gray-400 font-medium">Executive Template</p>
            </div>
            <div className="p-6 border-t border-gray-100 bg-white">
              <h3 className="text-xl font-bold text-gray-400">Template 3</h3>
              <p className="text-sm text-gray-400 mt-1">For senior and executive roles</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
