/**
 * Identifies which built-in resume template layout is active for export and UI.
 */
export type TemplateId = "template-1" | "template-2" | "template-3";

/**
 * Canonical ordering keys for resume sections (excluding the fixed header block).
 * Use this when persisting or reordering section order in the editor.
 */
export type SectionKey =
  | "profile"
  | "skills"
  | "experience"
  | "education"
  | "projects"
  | "languages"
  | "certifications";

/**
 * Personal and contact details shown in the resume header (name, links, phone, location, email).
 * Matches the template’s three centred lines: name; LinkedIn + phone; city/country + email.
 */
export interface PersonalInfo {
  fullName: string;
  linkedinUrl: string;
  phone: string;
  city: string;
  country: string;
  email: string;
}

/**
 * Profile / professional summary section — a single plain-text paragraph (max three sentences in the template).
 */
export interface Profile {
  summaryText: string;
}

/**
 * One skills grouping under “Skills & Technologies” (bold category label with comma-separated skills after the colon).
 */
export interface SkillCategory {
  id: string;
  categoryName: string;
  skills: string;
}

/**
 * A single employment row with role, company, dates, location, and bullet accomplishments.
 */
export interface WorkEntry {
  id: string;
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  location: string;
  bulletPoints: string[];
}

/**
 * One education line (degree, field, school, place, and year range).
 */
export interface EducationEntry {
  id: string;
  degreeType: string;
  fieldOfStudy: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
}

/**
 * Optional projects / extra section entry (bold title, synopsis, bold right-aligned date).
 */
export interface ProjectEntry {
  id: string;
  projectTitle: string;
  synopsis: string;
  date: string;
}

/**
 * One spoken language line with a proficiency label and optional CEFR level in parentheses.
 */
export interface LanguageEntry {
  id: string;
  language: string;
  proficiencyLabel: string;
  cefrLevel: string;
}

/**
 * A certification row (name, issuer, date aligned like the template).
 */
export interface CertEntry {
  id: string;
  certName: string;
  issuer: string;
  date: string;
}

/**
 * Root document shape for the resume builder: header plus every section from the DOCX template in a structured form.
 */
export interface ResumeData {
  personalInfo: PersonalInfo;
  profile: Profile;
  skills: SkillCategory[];
  experience: WorkEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  languages: LanguageEntry[];
  certifications: CertEntry[];
}
