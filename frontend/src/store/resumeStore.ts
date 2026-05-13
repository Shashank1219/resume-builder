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

import {
  generateWordCloud,
  parseResume,
  computeKeywordScore,
} from "@/lib/api/keywordScoringApi";

function plainTextFromHtml(html: string): string {
  if (!html) return "";
  if (typeof window !== "undefined") {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
  }
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    linkedinUrl: "",
    portfolioUrl: "",
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
  // Phase 1 State
  resumeData: ResumeData;
  selectedTemplate: string;
  sectionOrder: SectionKey[];
  activeSectionId: string | null;

  // Phase 2 State
  jobDescription: string;
  jobDescriptionId: string | null;
  wordCloudImage: string | null;
  jdKeywords: { keyword: string; frequency: number }[];
  keywordScore: number | null;
  parseWarnings: string[];
  scoringStep: 'input' | 'upload' | 'results';
  isAnalysing: boolean;
  scoringError: string | null;

  // Phase 1 Actions
  updatePersonalInfo: <K extends keyof PersonalInfo>(field: K, value: PersonalInfo[K]) => void;
  addWorkExperience: () => void;
  updateWorkExperience: <K extends keyof WorkEntry>(id: string, field: K, value: WorkEntry[K]) => void;
  removeWorkExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: <K extends keyof EducationEntry>(id: string, field: K, value: EducationEntry[K]) => void;
  removeEducation: (id: string) => void;
  addProject: () => void;
  updateProject: <K extends keyof ProjectEntry>(id: string, field: K, value: ProjectEntry[K]) => void;
  removeProject: (id: string) => void;
  updateSkills: <K extends keyof SkillCategory>(id: string, field: K, value: SkillCategory[K]) => void;
  reorderSections: (newOrder: SectionKey[]) => void;
  setActiveSection: (id: string | null) => void;

  // Phase 2 Actions
  setJobDescription: (text: string) => void;
  setScoringStep: (step: 'input' | 'upload' | 'results') => void;
  setScoringError: (error: string | null) => void;
  submitJobDescription: () => Promise<void>;
  uploadAndParseResume: (file: File) => Promise<void>;
  refreshScore: () => Promise<void>;
}

export const useResumeStore = create<ResumeStore>()(
  immer((set, get) => ({
    // Phase 1 Initial State
    resumeData: initialResumeData,
    selectedTemplate: "template-1",
    sectionOrder: initialSectionOrder,
    activeSectionId: null,

    // Phase 2 Initial State
    jobDescription: "",
    jobDescriptionId: null,
    wordCloudImage: null,
    jdKeywords: [],
    keywordScore: null,
    parseWarnings: [],
    scoringStep: 'input',
    isAnalysing: false,
    scoringError: null,

    // Phase 1 Actions
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
        const index = state.resumeData.experience.findIndex((e: { id: string; }) => e.id === id);
        if (index !== -1) {
          state.resumeData.experience[index][field] = value as never;
        }
      }),

    removeWorkExperience: (id) =>
      set((state) => {
        state.resumeData.experience = state.resumeData.experience.filter((e: { id: string; }) => e.id !== id);
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
        const index = state.resumeData.education.findIndex((e: { id: string; }) => e.id === id);
        if (index !== -1) {
          state.resumeData.education[index][field] = value as never;
        }
      }),

    removeEducation: (id) =>
      set((state) => {
        state.resumeData.education = state.resumeData.education.filter((e: { id: string; }) => e.id !== id);
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
        const index = state.resumeData.projects.findIndex((e: { id: string; }) => e.id === id);
        if (index !== -1) {
          state.resumeData.projects[index][field] = value as never;
        }
      }),

    removeProject: (id) =>
      set((state) => {
        state.resumeData.projects = state.resumeData.projects.filter((e: { id: string; }) => e.id !== id);
      }),

    updateSkills: (id, field, value) =>
      set((state) => {
        const index = state.resumeData.skills.findIndex((e: { id: string; }) => e.id === id);
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

    // Phase 2 Actions
    setJobDescription: (text) =>
      set((state) => {
        state.jobDescription = text;
      }),

    setScoringStep: (step) =>
      set((state) => {
        state.scoringStep = step;
      }),

    setScoringError: (error) =>
      set((state) => {
        state.scoringError = error;
      }),

    submitJobDescription: async () => {
      const jd = get().jobDescription;
      if (!jd.trim()) return;

      set((state) => {
        state.isAnalysing = true;
        state.scoringError = null;
      });

      try {
        const res = await generateWordCloud(jd);
        set((state) => {
          state.wordCloudImage = res.image;
          state.jobDescriptionId = res.jobDescriptionId;
          state.jdKeywords = res.keywords ?? [];
          state.scoringStep = 'upload';
        });
      } catch (err: any) {
        set((state) => {
          state.scoringError = err.message || "Failed to submit job description.";
        });
      } finally {
        set((state) => {
          state.isAnalysing = false;
        });
      }
    },

    uploadAndParseResume: async (file: File) => {
      set((state) => {
        state.isAnalysing = true;
        state.scoringError = null;
      });

      try {
        const res = await parseResume(file);
        set((state) => {
          if (res.personalInfo) {
            state.resumeData.personalInfo = { ...state.resumeData.personalInfo, ...res.personalInfo };
          }
          if (res.profile) {
            state.resumeData.profile = { ...state.resumeData.profile, ...res.profile };
          }
          if (res.skills && res.skills.length > 0) state.resumeData.skills = res.skills;
          if (res.experience && res.experience.length > 0) state.resumeData.experience = res.experience;
          if (res.education && res.education.length > 0) state.resumeData.education = res.education;
          if (res.projects && res.projects.length > 0) state.resumeData.projects = res.projects;
          if (res.languages && res.languages.length > 0) state.resumeData.languages = res.languages;
          if (res.certifications && res.certifications.length > 0) state.resumeData.certifications = res.certifications;
          state.parseWarnings = res.parseWarnings || [];
        });

        // Trigger score refresh automatically after successful parse
        await get().refreshScore();
      } catch (err: any) {
        set((state) => {
          state.scoringError = err.message || "Failed to parse resume.";
        });
      } finally {
        set((state) => {
          state.isAnalysing = false;
        });
      }
    },

    refreshScore: async () => {
      const jdId = get().jobDescriptionId;
      if (!jdId) return;

      set((state) => {
        state.isAnalysing = true;
        state.scoringError = null;
      });

      try {
        const { resumeData } = get();
        // Condense all textual data into one contiguous block for the sentence transformer
        const resumeText = [
          resumeData.personalInfo.fullName,
          resumeData.personalInfo.linkedinUrl,
          plainTextFromHtml(resumeData.profile.summaryText),
          ...resumeData.skills.map((s) => `${s.categoryName}: ${s.skills}`),
          ...resumeData.experience.map((e) =>
            `${e.jobTitle} ${e.companyName} ${(e.bulletPoints || []).map((bp) => plainTextFromHtml(bp)).join(" ")}`
          ),
          ...resumeData.education.map((e) => `${e.degreeType} ${e.fieldOfStudy} ${e.institution}`),
          ...resumeData.projects.map((p) => `${p.projectTitle} ${plainTextFromHtml(p.synopsis)}`),
          ...resumeData.languages.map((l) => `${l.language} ${l.proficiencyLabel} ${l.cefrLevel}`),
          ...resumeData.certifications.map((c) => `${c.certName} ${c.issuer} ${c.date}`),
        ].join(" ");

        const res = await computeKeywordScore(resumeText, jdId, get().jobDescription);
        set((state) => {
          state.keywordScore = res.score;
          state.scoringStep = 'results';
        });
      } catch (err: any) {
        set((state) => {
          state.scoringError = err.message || "Failed to compute keyword score.";
        });
      } finally {
        set((state) => {
          state.isAnalysing = false;
        });
      }
    },
  }))
);
