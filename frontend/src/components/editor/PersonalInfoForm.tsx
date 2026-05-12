import { useResumeStore } from "@/store/resumeStore";

export function PersonalInfoForm() {
  const data = useResumeStore((state) => state.resumeData.personalInfo);
  const update = useResumeStore((state) => state.updatePersonalInfo);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={data.fullName}
          onChange={(e) => update("fullName", e.target.value)}
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={data.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">City</label>
        <input
          type="text"
          className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={data.city}
          onChange={(e) => update("city", e.target.value)}
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">Country</label>
        <input
          type="text"
          className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={data.country}
          onChange={(e) => update("country", e.target.value)}
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">LinkedIn</label>
        <input
          type="url"
          className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={data.linkedinUrl}
          onChange={(e) => update("linkedinUrl", e.target.value)}
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">Portfolio URL</label>
        <input
          type="url"
          className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={data.portfolioUrl || ""}
          onChange={(e) => update("portfolioUrl", e.target.value)}
        />
      </div>
    </div>
  );
}
