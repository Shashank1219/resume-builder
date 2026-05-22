import type { ReactNode } from "react";

import type { ResumeData, SectionKey } from "@/types/resume";

import { sanitizeBasicHtml } from "@/lib/sanitizeBasicHtml";

import {

  TEMPLATE1_SECTION_ORDER,

  TEMPLATE1_SECTION_TITLES,

} from "./template1Spec";



const SECTION_HEADING =

  "mt-3 text-[13px] font-normal text-[#1155CC] pb-0.5 mb-1 border-b border-[#1155CC]";



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



  const order = sectionOrder?.length ? sectionOrder : TEMPLATE1_SECTION_ORDER;



  const cityCountry = [personalInfo.city, personalInfo.country].filter(Boolean).join(", ");



  const sections: Record<SectionKey, ReactNode> = {

    profile: (

      <section key="profile" aria-labelledby="template1-profile-heading">

        <h2 id="template1-profile-heading" className={SECTION_HEADING}>

          {TEMPLATE1_SECTION_TITLES.profile}

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

          {TEMPLATE1_SECTION_TITLES.skills}

        </h2>

        {skills.length > 0 ? (

          <div className="space-y-0 text-[11px]">

            {skills.map((cat) => (

              <p key={cat.id}>

                <span className="font-bold">{cat.categoryName}:</span> {cat.skills}

              </p>

            ))}

          </div>

        ) : (

          <p className="text-[11px] italic text-gray-300">Add skill categories</p>

        )}

      </section>

    ),

    experience: (

      <section key="experience" aria-labelledby="template1-experience-heading">

        <h2 id="template1-experience-heading" className={SECTION_HEADING}>

          {TEMPLATE1_SECTION_TITLES.experience}

        </h2>

        {experience.length > 0 ? (

          experience.map((job) => (

            <div key={job.id} className="mb-2">

              <div className="flex justify-between gap-2 text-[11px] font-bold">

                <div className="min-w-0 flex-1">

                  <span>{job.jobTitle}</span>

                  <span className="mx-2 tabular-nums">{job.companyName}</span>

                </div>

                <span className="shrink-0 whitespace-nowrap">

                  {job.startDate} - {job.isCurrent ? "Present" : job.endDate}

                </span>

              </div>

              <p className="text-[11px] text-gray-800">{job.location}</p>

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

          {TEMPLATE1_SECTION_TITLES.education}

        </h2>

        {education.length > 0 ? (

          education.map((edu) => (

            <div key={edu.id} className="mb-1 flex justify-between gap-2 text-[11px]">

              <p className="min-w-0 pr-2">

                <span className="font-bold">

                  {edu.degreeType}: {edu.fieldOfStudy}

                </span>

                {`, ${edu.institution}, ${edu.location}`}

              </p>

              <span className="shrink-0 whitespace-nowrap">

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

          {TEMPLATE1_SECTION_TITLES.projects}

        </h2>

        {projects.length > 0 ? (

          <ul className="list-outside list-disc pl-4 text-[11px]">

            {projects.map((proj) => (

              <li key={proj.id} className="mb-1">

                <div className="flex justify-between gap-2 font-bold">

                  <span>{proj.projectTitle}:</span>

                  <span className="shrink-0 whitespace-nowrap">{proj.date}</span>

                </div>

                {proj.synopsis.trim() ? (

                  <RichHtml html={proj.synopsis} className="font-normal leading-relaxed" />

                ) : null}

              </li>

            ))}

          </ul>

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

          {TEMPLATE1_SECTION_TITLES.languages}

        </h2>

        {languages.length > 0 ? (

          <div className="space-y-0 text-[11px]">

            {languages.map((lang) => (

              <p key={lang.id} className="flex">

                <span className="w-[5.5rem] shrink-0">{lang.language}:</span>

                <span>

                  {lang.proficiencyLabel} ({lang.cefrLevel})

                </span>

              </p>

            ))}

          </div>

        ) : (

          <p className="text-[11px] italic text-gray-300">

            Language: Proficiency (CEFR)

          </p>

        )}

      </section>

    ),

    certifications: (

      <section key="certifications" aria-labelledby="template1-certifications-heading">

        <h2 id="template1-certifications-heading" className={SECTION_HEADING}>

          {TEMPLATE1_SECTION_TITLES.certifications}

        </h2>

        {certifications.length > 0 ? (

          certifications.map((cert) => (

            <div key={cert.id} className="mb-1 flex justify-between gap-2 text-[11px]">

              <p className="min-w-0 pr-2">

                {cert.certName} ({cert.issuer})

              </p>

              <span className="shrink-0 font-bold whitespace-nowrap">{cert.date}</span>

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



  const line2Parts = [

    personalInfo.linkedinUrl.trim(),

    personalInfo.portfolioUrl.trim(),

  ].filter(Boolean);



  const line3Parts = [

    personalInfo.phone.trim(),

    cityCountry,

    personalInfo.email.trim(),

  ].filter(Boolean);



  return (

    <div className="w-[816px] bg-white p-10 font-sans text-[11px]">

      <header className="mb-3 text-center">

        <p className="text-[20px] font-normal leading-tight">

          {personalInfo.fullName.trim() || (

            <span className="italic text-gray-300">Your name</span>

          )}

        </p>

        <p className="mt-0.5">

          {line2Parts.length > 0 ? (

            line2Parts.map((part, i) => (

              <span key={i}>

                {i > 0 && <span className="px-1">•</span>}

                {part.includes("linkedin") || part.includes("http") ? (

                  <a

                    className="text-[#1155CC]"

                    href={linkedinHref(part)}

                    rel="noreferrer"

                    target="_blank"

                  >

                    {part}

                  </a>

                ) : (

                  <span className="text-[#1155CC]">{part}</span>

                )}

              </span>

            ))

          ) : (

            <span className="italic text-gray-300">LinkedIn • Portfolio</span>

          )}

        </p>

        <p className="mt-0.5">

          {line3Parts.length > 0 ? (

            line3Parts.map((part, i) => (

              <span key={i}>

                {i > 0 && <span className="px-1">•</span>}

                {part === personalInfo.email.trim() ? (

                  <span className="italic">{part}</span>

                ) : (

                  part

                )}

              </span>

            ))

          ) : (

            <span className="italic text-gray-300">Phone • City, Country • Email</span>

          )}

        </p>

      </header>



      {order.map((key) => sections[key])}

    </div>

  );

}

