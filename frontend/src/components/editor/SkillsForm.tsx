import { useResumeStore } from "@/store/resumeStore";
import { Trash2, Plus } from "lucide-react";

export function SkillsForm() {
  const skills = useResumeStore((state) => state.resumeData.skills);
  const updateSkills = useResumeStore((state) => state.updateSkills);

  // Zustand allows dynamic setState without explicitly adding actions for everything
  const addCategory = () => {
    useResumeStore.setState((state) => {
      state.resumeData.skills.push({
        id: crypto.randomUUID(),
        categoryName: "",
        skills: ""
      });
    });
  };

  const removeCategory = (id: string) => {
    useResumeStore.setState((state) => {
      state.resumeData.skills = state.resumeData.skills.filter(s => s.id !== id);
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-6">
        {skills.map((skill) => (
          <div key={skill.id} className="p-4 border rounded-md space-y-4 bg-gray-50 relative group">
            <button
              onClick={() => removeCategory(skill.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove"
            >
              <Trash2 size={18} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-6">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Frontend, Backend"
                  className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  value={skill.categoryName}
                  onChange={(e) => updateSkills(skill.id, "categoryName", e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Skills (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, TypeScript, Tailwind"
                  className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  value={skill.skills}
                  onChange={(e) => updateSkills(skill.id, "skills", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={addCategory}
        className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <Plus size={18} className="mr-2" />
        Add Skill Category
      </button>
    </div>
  );
}
