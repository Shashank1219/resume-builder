"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, CheckCircle, X } from "lucide-react";

export default function LandingPage() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
      {/* Session Warning Banner */}
      {showBanner && (
        <div className="bg-[#f8d7da] border-b border-[#f5c6cb] text-[#721c24] px-4 py-3 flex justify-between items-center relative z-50">
          <p className="text-sm font-medium w-full text-center">
            Your progress is saved only for this session. Refreshing the page will clear your resume.
          </p>
          <button 
            onClick={() => setShowBanner(false)}
            className="text-[#721c24] hover:bg-[#f5c6cb] p-1 rounded-full transition-colors absolute right-4 focus:outline-none"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="max-w-4xl w-full text-center mb-16 space-y-6">
          <div className="w-20 h-20 bg-[#0a192f] rounded-2xl flex items-center justify-center text-white font-bold text-4xl mx-auto shadow-xl">
            R
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#0a192f] tracking-tight">
            Resume Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create professional, ATS-friendly resumes in minutes. Designed to help you land your next big opportunity.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Build Resume Card */}
          <Link 
            href="/templates"
            className="group flex flex-col items-center p-8 bg-white border-2 border-[#0a192f] rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center cursor-pointer"
          >
            <div className="w-16 h-16 bg-[#0a192f] text-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <FileText size={32} />
            </div>
            <h2 className="text-2xl font-bold text-[#0a192f] mb-3">Build My Resume</h2>
            <p className="text-gray-600">
              Start fresh with our professional templates. Fill in your details and download an ATS-optimized PDF or DOCX.
            </p>
          </Link>

          {/* Score Resume Card (Greyed out) */}
          <div className="relative flex flex-col items-center p-8 bg-gray-50 border-2 border-gray-200 rounded-2xl text-center opacity-70 cursor-not-allowed">
            <div className="absolute top-4 right-4 bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Coming Soon
            </div>
            <div className="w-16 h-16 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-500 mb-3">Score My Resume</h2>
            <p className="text-gray-400">
              Upload your existing resume to get an instant ATS score and actionable feedback for improvement.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
