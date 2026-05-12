'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Download, ChevronLeft, AlertTriangle } from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';
import { KeywordScoreWidget } from '@/components/score';
import { WordCloudDisplay } from '@/components/word-cloud';
import { AccordionPanel } from '@/components/editor/AccordionPanel';
// import { exportAsDocx, exportAsPdf } from '@/lib/export'; // Imported from Phase 1

export default function KeywordScoringPage() {
  const {
    scoringStep,
    jobDescription,
    setJobDescription,
    submitJobDescription,
    isAnalysing,
    scoringError,
    uploadAndParseResume,
    keywordScore,
    wordCloudKeywords,
    parseWarnings,
    setScoringStep,
    refreshScore,
    resumeData
  } = useResumeStore();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false
  });

  const handleDownload = () => {
    // Phase 1 export logic stub
    console.log("Triggering Phase 1 download for: ", resumeData);
  };

  const renderInputStep = () => (
    <div className="max-w-3xl mx-auto flex flex-col space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-[#0a192f]">Score Your Resume Against a Job Description</h1>
        <p className="text-gray-500">Paste the target job description below to generate an AI-powered keyword analysis.</p>
      </div>

      {scoringError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{scoringError}</p>
        </div>
      )}

      <div className="space-y-2">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={12}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a192f] focus:border-transparent resize-none text-gray-700"
          placeholder="Paste job description here..."
        />
        <div className="text-right text-xs text-gray-400 font-medium">
          {jobDescription.length} characters
        </div>
      </div>

      <button
        onClick={submitJobDescription}
        disabled={jobDescription.length < 100 || isAnalysing}
        className="w-full py-3 bg-[#0a192f] text-white rounded-lg font-bold hover:bg-[#112240] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center h-12"
      >
        {isAnalysing ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          'Analyse Keywords'
        )}
      </button>
    </div>
  );

  const renderUploadStep = () => (
    <div className="max-w-3xl mx-auto flex flex-col space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center">
        <button
          onClick={() => setScoringStep('input')}
          className="flex items-center text-gray-500 hover:text-[#0a192f] transition-colors text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-[#0a192f]">Upload Your Resume</h1>
        <p className="text-gray-500">Upload your PDF or DOCX file to see how well it matches the job description.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
        <p className="text-sm">For the best keyword match results, please upload a resume built using one of the templates available on this platform.</p>
      </div>

      {scoringError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{scoringError}</p>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
      >
        <input {...getInputProps()} />
        {selectedFile ? (
          <p className="text-[#0a192f] font-semibold text-lg">{selectedFile.name}</p>
        ) : (
          <p className="text-gray-500">Drag & drop your resume here, or click to select file</p>
        )}
        <p className="text-xs text-gray-400 mt-2">Supports .docx and .pdf up to 5MB</p>
      </div>

      <button
        onClick={() => selectedFile && uploadAndParseResume(selectedFile)}
        disabled={!selectedFile || isAnalysing}
        className="w-full py-3 bg-[#0a192f] text-white rounded-lg font-bold hover:bg-[#112240] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center h-12"
      >
        {isAnalysing ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          'Score My Resume'
        )}
      </button>
    </div>
  );

  const renderResultsStep = () => (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setScoringStep('upload')}
            className="flex items-center text-gray-500 hover:text-[#0a192f] transition-colors text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          <h1 className="text-2xl font-extrabold text-[#0a192f]">Keyword Scoring</h1>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center px-4 py-2 bg-[#0a192f] text-white rounded-md text-sm font-medium hover:bg-[#112240] transition-colors shadow-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT COLUMN: 40% */}
        <div className="w-full lg:w-[40%] space-y-6">
          {parseWarnings && parseWarnings.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm">Parsing Warnings</h3>
              </div>
              <ul className="list-disc pl-5 text-xs space-y-1">
                {parseWarnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-center">
            <KeywordScoreWidget
              score={keywordScore}
              isRefreshing={isAnalysing}
              onRefresh={refreshScore}
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#0a192f] mb-4 text-center">Job Description Word Cloud</h3>
            <WordCloudDisplay keywords={wordCloudKeywords} />
          </div>
        </div>

        {/* RIGHT COLUMN: 60% */}
        <div className="w-full lg:w-[60%] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-160px)] overflow-y-auto">
          <AccordionPanel />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans">
      {scoringStep === 'input' && renderInputStep()}
      {scoringStep === 'upload' && renderUploadStep()}
      {scoringStep === 'results' && renderResultsStep()}
    </div>
  );
}
