import type { SectionKey } from "@/types/resume";

/** Matches template-1-clean.docx section order and labels. */
export const TEMPLATE1_SECTION_ORDER: SectionKey[] = [
  "profile",
  "skills",
  "experience",
  "education",
  "projects",
  "languages",
  "certifications",
];

export const TEMPLATE1_SECTION_TITLES: Record<SectionKey, string> = {
  profile: "Profile",
  skills: "Skills & Technologies",
  experience: "Work Experience",
  education: "Education",
  projects: "Projects",
  languages: "Languages",
  certifications: "Certification",
};

export const TEMPLATE1_BLUE = "1155CC";

/** docx half-points (11pt body, 13pt headings, 20pt name) */
export const DOCX_SIZE_BODY = 22;
export const DOCX_SIZE_HEADING = 26;
export const DOCX_SIZE_NAME = 40;
