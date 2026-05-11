import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  ResumeData,
  SectionKey,
  PersonalInfo,
  WorkEntry,
  EducationEntry,
  ProjectEntry,
  SkillCategory,
} from "../types/resume";

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    linkedinUrl: "",
    phone: "",
    city: "",
    country: "",
    email: "",
  },
  profile: {
    summaryText: "",
  },
  skills: [],
  experience: [],
  education: [],
  projects: [],
  languages: [],
  certifications: [],
};

const initialSectionOrder: SectionKey[] = [
  "profile",
  "skills",
  "experience",
  "education",
  "projects",
  "languages",
  "certifications",
];

interface ResumeStore {
  resumeData: ResumeData;
  selectedTemplate: string;
  sectionOrder: SectionKey[];
  activeSectionId: string | null;

  updatePersonalInfo: <K extends keyof PersonalInfo>(
    field: K,
    value: PersonalInfo[K]
  ) => void;

  addWorkExperience: () => void;
  updateWorkExperience: <K extends keyof WorkEntry>(
    id: string,
    field: K,
    value: WorkEntry[K]
  ) => void;
  removeWorkExperience: (id: string) => void;

  addEducation: () => void;
  updateEducation: <K extends keyof EducationEntry>(
    id: string,
    field: K,
    value: EducationEntry[K]
  ) => void;
  removeEducation: (id: string) => void;

  addProject: () => void;
  updateProject: <K extends keyof ProjectEntry>(
    id: string,
    field: K,
    value: ProjectEntry[K]
  ) => void;
  removeProject: (id: string) => void;

  updateSkills: <K extends keyof SkillCategory>(
    id: string,
    field: K,
    value: SkillCategory[K]
  ) => void;

  reorderSections: (newOrder: SectionKey[]) => void;
  setActiveSection: (id: string | null) => void;
}

export const useResumeStore = create<ResumeStore>()(
  immer((set) => ({
    resumeData: initialResumeData,
    selectedTemplate: "template-1",
    sectionOrder: initialSectionOrder,
    activeSectionId: null,

    updatePersonalInfo: (field, value) =>
      set((state) => {
        state.resumeData.personalInfo[field] = value;
      }),

    addWorkExperience: () =>
      set((state) => {
        state.resumeData.experience.push({
          id: crypto.randomUUID(),
          jobTitle: "",
          companyName: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          location: "",
          bulletPoints: [],
        });
      }),

    updateWorkExperience: (id, field, value) =>
      set((state) => {
        const index = state.resumeData.experience.findIndex((e) => e.id === id);
        if (index !== -1) {
          state.resumeData.experience[index][field] = value as never;
        }
      }),

    removeWorkExperience: (id) =>
      set((state) => {
        state.resumeData.experience = state.resumeData.experience.filter(
          (e) => e.id !== id
        );
      }),

    addEducation: () =>
      set((state) => {
        state.resumeData.education.push({
          id: crypto.randomUUID(),
          degreeType: "",
          fieldOfStudy: "",
          institution: "",
          location: "",
          startYear: "",
          endYear: "",
        });
      }),

    updateEducation: (id, field, value) =>
      set((state) => {
        const index = state.resumeData.education.findIndex((e) => e.id === id);
        if (index !== -1) {
          state.resumeData.education[index][field] = value as never;
        }
      }),

    removeEducation: (id) =>
      set((state) => {
        state.resumeData.education = state.resumeData.education.filter(
          (e) => e.id !== id
        );
      }),

    addProject: () =>
      set((state) => {
        state.resumeData.projects.push({
          id: crypto.randomUUID(),
          projectTitle: "",
          synopsis: "",
          date: "",
        });
      }),

    updateProject: (id, field, value) =>
      set((state) => {
        const index = state.resumeData.projects.findIndex((e) => e.id === id);
        if (index !== -1) {
          state.resumeData.projects[index][field] = value as never;
        }
      }),

    removeProject: (id) =>
      set((state) => {
        state.resumeData.projects = state.resumeData.projects.filter(
          (e) => e.id !== id
        );
      }),

    updateSkills: (id, field, value) =>
      set((state) => {
        const index = state.resumeData.skills.findIndex((e) => e.id === id);
        if (index !== -1) {
          state.resumeData.skills[index][field] = value as never;
        }
      }),

    reorderSections: (newOrder) =>
      set((state) => {
        state.sectionOrder = newOrder;
      }),

    setActiveSection: (id) =>
      set((state) => {
        state.activeSectionId = id;
      }),
  }))
);
