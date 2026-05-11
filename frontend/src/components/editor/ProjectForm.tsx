import { useResumeStore } from "@/store/resumeStore";
import { RichTextEditor } from "./RichTextEditor";
import { Trash2, Plus } from "lucide-react";

export function ProjectForm() {
  const projects = useResumeStore((state) => state.resumeData.projects);
  const addProject = useResumeStore((state) => state.addProject);
  const updateProject = useResumeStore((state) => state.updateProject);
  const removeProject = useResumeStore((state) => state.removeProject);

  return (
    <div className="space-y-6">
      {projects.map((proj) => (
        <div key={proj.id} className="p-4 border rounded-md space-y-4 bg-gray-50 relative group">
          <button
            onClick={() => removeProject(proj.id)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            title="Remove"
          >
            <Trash2 size={18} />
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-6">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Project Title</label>
              <input
                type="text"
                className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                value={proj.projectTitle}
                onChange={(e) => updateProject(proj.id, "projectTitle", e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <input
                type="text"
                className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                value={proj.date}
                onChange={(e) => updateProject(proj.id, "date", e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <div className="bg-white rounded-md">
                <RichTextEditor
                  value={proj.synopsis}
                  onChange={(html) => updateProject(proj.id, "synopsis", html)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <button
        onClick={addProject}
        className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <Plus size={18} className="mr-2" />
        Add Project
      </button>
    </div>
  );
}
