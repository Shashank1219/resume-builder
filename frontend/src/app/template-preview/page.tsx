import Template1 from "@/templates/template-1/Template1";
import { sampleResumeData } from "@/templates/template-1/sampleData";

export default function TemplatePreviewPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="border-b border-gray-200 bg-white px-4 py-2 text-center text-sm text-gray-700">
        Template Preview Mode
      </header>
      <main className="flex flex-1 justify-center overflow-auto px-4 py-8">
        <div className="rounded-lg bg-white shadow-md">
          <Template1 data={sampleResumeData} />
        </div>
      </main>
    </div>
  );
}
