import { useResumeStore } from "@/store/resumeStore";
import { Trash2, Plus } from "lucide-react";

export function LanguagesForm() {
  const languages = useResumeStore((state) => state.resumeData.languages);

  const addLanguage = () => {
    useResumeStore.setState((state) => {
      state.resumeData.languages.push({
        id: crypto.randomUUID(),
        language: "",
        proficiencyLabel: "",
        cefrLevel: "",
      });
    });
  };

  const updateLanguage = (id: string, field: string, value: string) => {
    useResumeStore.setState((state) => {
      const index = state.resumeData.languages.findIndex((l) => l.id === id);
      if (index !== -1) {
        (state.resumeData.languages[index] as any)[field] = value;
      }
    });
  };

  const removeLanguage = (id: string) => {
    useResumeStore.setState((state) => {
      state.resumeData.languages = state.resumeData.languages.filter((l) => l.id !== id);
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-6">
        {languages.map((lang) => (
          <div key={lang.id} className="p-4 border rounded-md space-y-4 bg-gray-50 relative group">
            <button
              onClick={() => removeLanguage(lang.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove"
            >
              <Trash2 size={18} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-6">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Language</label>
                <input
                  type="text"
                  placeholder="e.g. English"
                  className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  value={lang.language}
                  onChange={(e) => updateLanguage(lang.id, "language", e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Proficiency</label>
                <input
                  type="text"
                  placeholder="e.g. Native, Fluent"
                  className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  value={lang.proficiencyLabel}
                  onChange={(e) => updateLanguage(lang.id, "proficiencyLabel", e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">CEFR Level (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. C1, B2"
                  className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  value={lang.cefrLevel}
                  onChange={(e) => updateLanguage(lang.id, "cefrLevel", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={addLanguage}
        className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <Plus size={18} className="mr-2" />
        Add Language
      </button>
    </div>
  );
}
