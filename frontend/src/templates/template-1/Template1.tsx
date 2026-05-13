import type { ReactNode } from "react";
import type { ResumeData, SectionKey } from "@/types/resume";
import { sanitizeBasicHtml } from "@/lib/sanitizeBasicHtml";

const SECTION_HEADING =
  "mt-3 text-[13px] font-normal text-[#1155CC] pb-0.5 mb-1 border-b border-[#1155CC]";

const DEFAULT_SECTION_ORDER: SectionKey[] = [
  "profile",
  "skills",
  "experience",
  "education",
  "projects",
  "languages",
  "certifications",
];

export interface Template1Props {
  data: ResumeData;
  /** When omitted, uses the default template section order. */
  sectionOrder?: SectionKey[];
}

function linkedinHref(url: string): string {
  const t = url.trim();
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

function RichHtml({ html, className }: { html: string; className?: string }) {
  const trimmed = html?.trim();
  if (!trimmed) return null;
  return (
    <div
      className={`${className ?? ""} [&_p]:my-1 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_strong]:font-bold [&_em]:italic [&_a]:text-[#1155CC] [&_a]:underline`}
      dangerouslySetInnerHTML={{ __html: sanitizeBasicHtml(trimmed) }}
    />
  );
}

export default function Template1({ data, sectionOrder }: Template1Props) {
  const { personalInfo, profile, skills, experience, education, projects, languages, certifications } =
    data;

  const order = sectionOrder?.length ? sectionOrder : DEFAULT_SECTION_ORDER;

  const cityCountry = [personalInfo.city, personalInfo.country].filter(Boolean).join(", ");

  const sections: Record<SectionKey, ReactNode> = {
    profile: (
      <section key="profile" aria-labelledby="template1-profile-heading">
        <h2 id="template1-profile-heading" className={SECTION_HEADING}>
          Profile
        </h2>
        {profile.summaryText.trim() ? (
          <RichHtml html={profile.summaryText} className="text-[11px] leading-relaxed" />
        ) : (
          <p className="text-[11px] leading-relaxed italic text-gray-300">
            Add a 2–3 sentence professional summary
          </p>
        )}
      </section>
    ),
    skills: (
      <section key="skills" aria-labelledby="template1-skills-heading">
        <h2 id="template1-skills-heading" className={SECTION_HEADING}>
          Skills & Technologies
        </h2>
        {skills.length > 0 ? (
          <ul className="list-inside list-disc text-[11px]">
            {skills.map((cat) => (
              <li key={cat.id}>
                <span className="font-bold">{cat.categoryName}:</span> {cat.skills}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="list-inside list-disc text-[11px]">
            <li className="italic text-gray-300">Add skill categories</li>
          </ul>
        )}
      </section>
    ),
    experience: (
      <section key="experience" aria-labelledby="template1-experience-heading">
        <h2 id="template1-experience-heading" className={SECTION_HEADING}>
          Work Experience
        </h2>
        {experience.length > 0 ? (
          experience.map((job) => (
            <div key={job.id} className="mb-2">
              <div className="flex justify-between text-[11px]">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-bold">{job.jobTitle}</span>
                  <span className="font-bold">{job.companyName}</span>
                </div>
                <span className="shrink-0 font-bold">
                  {job.startDate} - {job.isCurrent ? "Present" : job.endDate}
                </span>
              </div>
              <p className="text-[10px] italic text-gray-600">{job.location}</p>
              {job.bulletPoints.length > 0 ? (
                <ul className="list-outside list-disc pl-4 text-[11px]">
                  {job.bulletPoints.map((bp, i) => (
                    <li key={`${job.id}-bp-${i}`} className="pl-0.5">
                      <RichHtml html={bp} className="inline text-[11px]" />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] italic text-gray-300">Add responsibilities</p>
              )}
            </div>
          ))
        ) : (
          <p className="mb-2 text-[11px] italic text-gray-300">
            Add roles, companies, dates, and accomplishments
          </p>
        )}
      </section>
    ),
    education: (
      <section key="education" aria-labelledby="template1-education-heading">
        <h2 id="template1-education-heading" className={SECTION_HEADING}>
          Education
        </h2>
        {education.length > 0 ? (
          education.map((edu) => (
            <div key={edu.id} className="mb-1 flex justify-between text-[11px]">
              <p className="pr-2">
                <span className="font-bold">
                  {edu.degreeType}: {edu.fieldOfStudy}
                </span>
                {`, ${edu.institution}, ${edu.location}`}
              </p>
              <span className="shrink-0">
                {edu.startYear} - {edu.endYear}
              </span>
            </div>
          ))
        ) : (
          <p className="mb-1 text-[11px] italic text-gray-300">
            Add degree, institution, location, and years
          </p>
        )}
      </section>
    ),
    projects: (
      <section key="projects" aria-labelledby="template1-projects-heading">
        <h2 id="template1-projects-heading" className={SECTION_HEADING}>
          Projects & Extra
        </h2>
        {projects.length > 0 ? (
          projects.map((proj) => (
            <div key={proj.id} className="mb-2 text-[11px]">
              <div className="flex justify-between gap-2">
                <p className="pr-2 font-bold">{proj.projectTitle}</p>
                <span className="shrink-0 font-bold">{proj.date}</span>
              </div>
              <RichHtml html={proj.synopsis} className="pl-0 text-[11px] leading-relaxed" />
            </div>
          ))
        ) : (
          <p className="mb-1 text-[11px] italic text-gray-300">
            Add projects, descriptions, and dates
          </p>
        )}
      </section>
    ),
    languages: (
      <section key="languages" aria-labelledby="template1-languages-heading">
        <h2 id="template1-languages-heading" className={SECTION_HEADING}>
          Languages
        </h2>
        {languages.length > 0 ? (
          <ul className="list-inside list-disc text-[11px]">
            {languages.map((lang) => (
              <li key={lang.id}>
                <span className="inline-block min-w-[6rem]">{lang.language}:</span>
                <span className="pl-2">
                  {lang.proficiencyLabel} ({lang.cefrLevel})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="list-inside list-disc text-[11px]">
            <li className="italic text-gray-300">
              <span className="inline-block min-w-[6rem]">Language:</span>
              <span className="pl-2">Proficiency (CEFR)</span>
            </li>
          </ul>
        )}
      </section>
    ),
    certifications: (
      <section key="certifications" aria-labelledby="template1-certifications-heading">
        <h2 id="template1-certifications-heading" className={SECTION_HEADING}>
          Certifications
        </h2>
        {certifications.length > 0 ? (
          certifications.map((cert) => (
            <div key={cert.id} className="mb-1 flex justify-between text-[11px]">
              <p className="pr-2">
                {cert.certName} ({cert.issuer})
              </p>
              <span className="shrink-0 font-bold">{cert.date}</span>
            </div>
          ))
        ) : (
          <p className="mb-1 text-[11px] italic text-gray-300">
            Add certifications, issuers, and dates
          </p>
        )}
      </section>
    ),
  };

  return (
    <div className="w-[816px] bg-white p-10 font-sans">
      <header className="mb-3 text-center">
        <p className="text-[20px] font-normal">
          {personalInfo.fullName.trim() || (
            <span className="italic text-gray-300">Your name</span>
          )}
        </p>
        <p className="text-[11px]">
          {personalInfo.linkedinUrl.trim() ? (
            <a
              className="text-[#1155CC]"
              href={linkedinHref(personalInfo.linkedinUrl)}
              rel="noreferrer"
              target="_blank"
            >
              {personalInfo.linkedinUrl.trim()}
            </a>
          ) : (
            <span className="italic text-gray-300">LinkedIn</span>
          )}
          {personalInfo.portfolioUrl.trim() && (
            <>
              <span className="px-1">•</span>
              <a
                className="text-[#1155CC]"
                href={linkedinHref(personalInfo.portfolioUrl)}
                rel="noreferrer"
                target="_blank"
              >
                {personalInfo.portfolioUrl.trim()}
              </a>
            </>
          )}
          <span className="px-1">•</span>
          {personalInfo.phone.trim() || <span className="italic text-gray-300">Phone</span>}
        </p>
        <p className="text-[11px]">
          {cityCountry || <span className="italic text-gray-300">City, Country</span>}
          <span className="px-1">•</span>
          {personalInfo.email.trim() ? (
            <span className="italic">{personalInfo.email.trim()}</span>
          ) : (
            <span className="italic text-gray-300">Email</span>
          )}
        </p>
      </header>

      {order.map((key) => sections[key])}
    </div>
  );
}
