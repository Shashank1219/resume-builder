import type {
  PersonalInfo,
  Profile,
  SkillCategory,
  WorkEntry,
  EducationEntry,
  ProjectEntry,
  LanguageEntry,
  CertEntry,
} from "@/types/resume";

export interface WordCloudKeyword {
  text: string;
  value: number;
  category: "technical" | "soft_skill";
}

export interface WordCloudResponse {
  keywords: WordCloudKeyword[];
  jobDescriptionId: string;
}

export interface KeywordScoreResponse {
  score: number;
  jobDescriptionId: string;
}

export interface ResumeParseResponse {
  personalInfo?: PersonalInfo;
  profile?: Profile;
  skills: SkillCategory[];
  experience: WorkEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  languages: LanguageEntry[];
  certifications: CertEntry[];
  parseWarnings: string[];
}

export async function parseResume(file: File): Promise<ResumeParseResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/parse-resume", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to parse resume: ${response.statusText}`);
  }

  return response.json();
}

export async function generateWordCloud(jobDescription: string): Promise<WordCloudResponse> {
  const response = await fetch("/api/word-cloud", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ jobDescription }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to generate word cloud: ${response.statusText}`);
  }

  return response.json();
}

export async function computeKeywordScore(resumeText: string, jobDescriptionId: string): Promise<KeywordScoreResponse> {
  const response = await fetch("/api/keyword-score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resumeText, jobDescriptionId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to compute keyword score: ${response.statusText}`);
  }

  return response.json();
}
