import type { ResumeData } from "@/types/resume";

const SECTION_HEADING =
  "mt-3 text-[13px] font-normal text-[#1155CC] pb-0.5 mb-1 border-b border-[#1155CC]";

export interface Template1Props {
  data: ResumeData;
}

function linkedinHref(url: string): string {
  const t = url.trim();
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

export default function Template1({ data }: Template1Props) {
  const { personalInfo, profile, skills, experience, education, projects, languages, certifications } =
    data;

  const cityCountry = [personalInfo.city, personalInfo.country].filter(Boolean).join(", ");

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
          <span className="px-1">•</span>
          {personalInfo.phone.trim() || (
            <span className="italic text-gray-300">Phone</span>
          )}
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

      <section aria-labelledby="template1-profile-heading">
        <h2 id="template1-profile-heading" className={SECTION_HEADING}>
          Profile
        </h2>
        {profile.summaryText.trim() ? (
          <p className="text-[11px] leading-relaxed">{profile.summaryText.trim()}</p>
        ) : (
          <p className="text-[11px] leading-relaxed italic text-gray-300">
            Add a 2–3 sentence professional summary
          </p>
        )}
      </section>

      <section aria-labelledby="template1-skills-heading">
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

      <section aria-labelledby="template1-experience-heading">
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
                <ul className="list-inside list-disc text-[11px]">
                  {job.bulletPoints.map((bp, i) => (
                    <li key={`${job.id}-bp-${i}`}>{bp}</li>
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

      <section aria-labelledby="template1-education-heading">
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

      <section aria-labelledby="template1-projects-heading">
        <h2 id="template1-projects-heading" className={SECTION_HEADING}>
          Projects & Extra
        </h2>
        {projects.length > 0 ? (
          projects.map((proj) => (
            <div key={proj.id} className="mb-1 flex justify-between text-[11px]">
              <p className="pr-2">
                <span className="font-bold">{proj.projectTitle}:</span> {proj.synopsis}
              </p>
              <span className="shrink-0 font-bold">{proj.date}</span>
            </div>
          ))
        ) : (
          <p className="mb-1 text-[11px] italic text-gray-300">
            Add projects, descriptions, and dates
          </p>
        )}
      </section>

      <section aria-labelledby="template1-languages-heading">
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

      <section aria-labelledby="template1-certifications-heading">
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
    </div>
  );
}
