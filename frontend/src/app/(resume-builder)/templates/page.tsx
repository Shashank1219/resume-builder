"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useResumeStore } from "@/store/resumeStore";
import Template1 from "@/templates/template-1";
import { sampleResumeData } from "@/templates/template-1/sampleData";

interface TemplateCardProps {
  children: React.ReactNode;
  label: string;
  badge?: string;
  onClick?: () => void;
  disabled?: boolean;
}

function TemplateCard({ children, label, badge, onClick, disabled = false }: TemplateCardProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={onClick}
        disabled={disabled}
        className={[
          "group relative w-full border-2 rounded-xl overflow-hidden shadow-sm transition-all duration-200 bg-white",
          disabled
            ? "border-gray-200 cursor-not-allowed opacity-60"
            : "border-gray-200 hover:border-[#0a192f] hover:shadow-md cursor-pointer",
        ].join(" ")}
      >
        <div className="h-[285px] overflow-hidden">{children}</div>
        {!disabled && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
            <span className="bg-[#0a192f] text-white text-sm font-semibold px-4 py-2 rounded-lg">
              Select Template
            </span>
          </div>
        )}
        {badge && (
          <div className="absolute top-3 right-3 bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {badge}
          </div>
        )}
      </button>
      <p className="text-sm font-medium text-gray-700">{label}</p>
    </div>
  );
}

export default function TemplatesPage() {
  const router = useRouter();
  const setTemplate = () => {
    useResumeStore.setState({ selectedTemplate: "template-1" });
    router.push("/editor");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <Link
          href="/"
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">Choose a Template</h1>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-gray-500 text-sm mb-10 text-center">
          Select a template to start building your resume.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <TemplateCard label="Template 1 — Classic" onClick={setTemplate}>
            <div className="w-[816px] scale-[0.349] origin-top-left pointer-events-none select-none">
              <Template1 data={sampleResumeData} />
            </div>
          </TemplateCard>

          <TemplateCard label="Template 2" badge="Coming Soon" disabled>
            <div className="flex h-full items-center justify-center bg-gray-50">
              <p className="text-gray-400 text-sm italic">Coming Soon</p>
            </div>
          </TemplateCard>

          <TemplateCard label="Template 3" badge="Coming Soon" disabled>
            <div className="flex h-full items-center justify-center bg-gray-50">
              <p className="text-gray-400 text-sm italic">Coming Soon</p>
            </div>
          </TemplateCard>
        </div>
      </main>
    </div>
  );
}
