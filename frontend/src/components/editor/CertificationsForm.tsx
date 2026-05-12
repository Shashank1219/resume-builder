import { useResumeStore } from "@/store/resumeStore";
import { MonthYearPicker } from "./MonthYearPicker";
import { Trash2, Plus } from "lucide-react";

export function CertificationsForm() {
  const certifications = useResumeStore((state) => state.resumeData.certifications);

  const addCert = () => {
    useResumeStore.setState((state) => {
      state.resumeData.certifications.push({
        id: crypto.randomUUID(),
        certName: "",
        issuer: "",
        date: "",
      });
    });
  };

  const updateCert = (id: string, field: string, value: string) => {
    useResumeStore.setState((state) => {
      const index = state.resumeData.certifications.findIndex((c) => c.id === id);
      if (index !== -1) {
        (state.resumeData.certifications[index] as any)[field] = value;
      }
    });
  };

  const removeCert = (id: string) => {
    useResumeStore.setState((state) => {
      state.resumeData.certifications = state.resumeData.certifications.filter((c) => c.id !== id);
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-6">
        {certifications.map((cert) => (
          <div key={cert.id} className="p-4 border rounded-md space-y-4 bg-gray-50 relative group">
            <button
              onClick={() => removeCert(cert.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove"
            >
              <Trash2 size={18} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-6">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Certification Name</label>
                <input
                  type="text"
                  className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  value={cert.certName}
                  onChange={(e) => updateCert(cert.id, "certName", e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Issuer</label>
                <input
                  type="text"
                  className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  value={cert.issuer}
                  onChange={(e) => updateCert(cert.id, "issuer", e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Date</label>
                <MonthYearPicker
                  value={cert.date}
                  onChange={(val) => updateCert(cert.id, "date", val)}
                  placeholder="e.g. 05-2023 or 2023"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={addCert}
        className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <Plus size={18} className="mr-2" />
        Add Certification
      </button>
    </div>
  );
}
