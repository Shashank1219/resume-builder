import { useResumeStore } from "@/store/resumeStore";
import { MonthYearPicker } from "./MonthYearPicker";
import { Trash2, Plus } from "lucide-react";

export function EducationForm() {
  const educations = useResumeStore((state) => state.resumeData.education);
  const addEducation = useResumeStore((state) => state.addEducation);
  const updateEducation = useResumeStore((state) => state.updateEducation);
  const removeEducation = useResumeStore((state) => state.removeEducation);

  return (
    <div className="space-y-4">
      <div className="space-y-6">
        {educations.map((edu) => (
          <div key={edu.id} className="p-4 border rounded-md space-y-4 bg-gray-50 relative group">
            <button
              onClick={() => removeEducation(edu.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove"
            >
              <Trash2 size={18} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-6">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Degree</label>
                <input
                  type="text"
                  className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  value={edu.degreeType}
                  onChange={(e) => updateEducation(edu.id, "degreeType", e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Field of Study</label>
                <input
                  type="text"
                  className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  value={edu.fieldOfStudy}
                  onChange={(e) => updateEducation(edu.id, "fieldOfStudy", e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Institution</label>
                <input
                  type="text"
                  className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  value={edu.location}
                  onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Start Year</label>
                <MonthYearPicker
                  value={edu.startYear}
                  onChange={(val) => updateEducation(edu.id, "startYear", val)}
                  placeholder="e.g. 08-2020 or 2020"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">End Year</label>
                <MonthYearPicker
                  value={edu.endYear}
                  onChange={(val) => updateEducation(edu.id, "endYear", val)}
                  placeholder="e.g. 05-2024 or 2024"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={addEducation}
        className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <Plus size={18} className="mr-2" />
        Add Education
      </button>
    </div>
  );
}
