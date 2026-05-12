import { useResumeStore } from "@/store/resumeStore";
import { RichTextEditor } from "./RichTextEditor";
import { MonthYearPicker } from "./MonthYearPicker";
import { Trash2, Plus } from "lucide-react";

export function WorkExperienceForm() {
  const experiences = useResumeStore((state) => state.resumeData.experience);
  const addWorkExperience = useResumeStore((state) => state.addWorkExperience);
  const updateWorkExperience = useResumeStore((state) => state.updateWorkExperience);
  const removeWorkExperience = useResumeStore((state) => state.removeWorkExperience);

  return (
    <div className="space-y-4">
      <div className="space-y-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="p-4 border rounded-md space-y-4 bg-gray-50 relative group">
            <button
              onClick={() => removeWorkExperience(exp.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove"
            >
              <Trash2 size={18} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-6">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Job Title</label>
                <input
                  type="text"
                  className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  value={exp.jobTitle}
                  onChange={(e) => updateWorkExperience(exp.id, "jobTitle", e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Company</label>
                <input
                  type="text"
                  className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  value={exp.companyName}
                  onChange={(e) => updateWorkExperience(exp.id, "companyName", e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Start Date</label>
                <MonthYearPicker
                  value={exp.startDate}
                  onChange={(val) => updateWorkExperience(exp.id, "startDate", val)}
                  placeholder="e.g. 05-2022 or May 2022"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">End Date</label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    {exp.isCurrent ? (
                      <input
                        type="text"
                        className="w-full border rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                        value="Present"
                        disabled
                      />
                    ) : (
                      <MonthYearPicker
                        value={exp.endDate}
                        onChange={(val) => updateWorkExperience(exp.id, "endDate", val)}
                        placeholder="e.g. 08-2023 or Present"
                      />
                    )}
                  </div>
                  <label className="flex items-center space-x-1 text-sm text-gray-600 shrink-0">
                    <input
                      type="checkbox"
                      checked={exp.isCurrent}
                      onChange={(e) => updateWorkExperience(exp.id, "isCurrent", e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Current</span>
                  </label>
                </div>
              </div>
              <div className="flex flex-col space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  value={exp.location}
                  onChange={(e) => updateWorkExperience(exp.id, "location", e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Description / Achievements</label>
                <div className="bg-white rounded-md border">
                  <RichTextEditor
                    value={exp.bulletPoints.join("")}
                    onChange={(html) => updateWorkExperience(exp.id, "bulletPoints", [html])}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={addWorkExperience}
        className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <Plus size={18} className="mr-2" />
        Add Work Experience
      </button>
    </div>
  );
}
