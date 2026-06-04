import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
} from "docx";
import { saveAs } from "file-saver";
import { Document as PdfDocument, pdf } from "@react-pdf/renderer";
import type { ResumeData, SectionKey } from "@/types/resume";
import { ResumePdfDocument } from "./pdf/ResumePdfDocument";
import React from "react";
import {
  TEMPLATE1_SECTION_ORDER,
  TEMPLATE1_SECTION_TITLES,
  TEMPLATE1_BLUE,
  DOCX_SIZE_BODY,
  DOCX_SIZE_HEADING,
  DOCX_SIZE_NAME,
} from "@/templates/template-1/template1Spec";
import { htmlToDocxRuns, htmlToPlainText } from "@/templates/template-1/htmlToDocxRuns";

function sectionHeading(title: string): Paragraph {
  return new Paragraph({
    spacing: { before: 100, after: 0 },
    border: {
      bottom: {
        color: TEMPLATE1_BLUE,
        size: 8,
        style: BorderStyle.SINGLE,
        space: 2,
      },
    },
    children: [
      new TextRun({
        text: title,
        color: TEMPLATE1_BLUE,
        size: DOCX_SIZE_HEADING,
      }),
    ],
  });
}

function bodyParagraph(children: TextRun[] | string, options?: { bullet?: boolean }): Paragraph {
  if (typeof children === "string") {
    return new Paragraph({
      children: [new TextRun({ text: children, size: DOCX_SIZE_BODY })],
      bullet: options?.bullet ? { level: 0 } : undefined,
    });
  }
  return new Paragraph({
    children,
    bullet: options?.bullet ? { level: 0 } : undefined,
  });
}

function buildDocxChildren(data: ResumeData, order: SectionKey[]): Paragraph[] {
  const { personalInfo, profile, skills, experience, education, projects, languages, certifications } =
    data;
  const cityCountry = [personalInfo.city, personalInfo.country].filter(Boolean).join(", ");
  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: personalInfo.fullName.trim() || "Your Name",
          size: DOCX_SIZE_NAME,
        }),
      ],
    })
  );

  const line2 = [personalInfo.linkedinUrl, personalInfo.portfolioUrl].filter((s) => s?.trim()).join(" • ");
  if (line2) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: line2, size: DOCX_SIZE_BODY, color: TEMPLATE1_BLUE })],
      })
    );
  }

  const line3Parts = [
    personalInfo.phone?.trim(),
    cityCountry,
    personalInfo.email?.trim(),
  ].filter(Boolean) as string[];

  if (line3Parts.length > 0) {
    const runs: TextRun[] = [];
    line3Parts.forEach((part, i) => {
      if (i > 0) runs.push(new TextRun({ text: " • ", size: DOCX_SIZE_BODY }));
      runs.push(
        new TextRun({
          text: part,
          size: DOCX_SIZE_BODY,
          italics: part === personalInfo.email?.trim(),
        })
      );
    });

    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: runs,
      })
    );
  }

  const sectionBuilders: Record<SectionKey, () => void> = {
    profile: () => {
      if (!profile.summaryText.trim()) return;
      children.push(sectionHeading(TEMPLATE1_SECTION_TITLES.profile));
      const runs = htmlToDocxRuns(profile.summaryText);
      children.push(bodyParagraph(runs.length ? runs : htmlToPlainText(profile.summaryText)));
    },
    skills: () => {
      if (skills.length === 0) return;
      children.push(sectionHeading(TEMPLATE1_SECTION_TITLES.skills));
      skills.forEach((cat) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${cat.categoryName}: `, bold: true, size: DOCX_SIZE_BODY }),
              new TextRun({ text: cat.skills, size: DOCX_SIZE_BODY }),
            ],
          })
        );
      });
    },
    experience: () => {
      if (experience.length === 0) return;
      children.push(sectionHeading(TEMPLATE1_SECTION_TITLES.experience));
      experience.forEach((job) => {
        const dateRange = `${job.startDate} - ${job.isCurrent ? "Present" : job.endDate}`;
        children.push(
          new Paragraph({
            tabStops: [
              { type: TabStopType.LEFT, position: 3600 },
              { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
            ],
            children: [
              new TextRun({ text: job.jobTitle, bold: true, size: DOCX_SIZE_BODY }),
              new TextRun({ text: "\t", size: DOCX_SIZE_BODY }),
              new TextRun({ text: job.companyName, bold: true, size: DOCX_SIZE_BODY }),
              new TextRun({ text: "\t", size: DOCX_SIZE_BODY }),
              new TextRun({ text: dateRange, bold: true, size: DOCX_SIZE_BODY }),
            ],
          })
        );
        if (job.location.trim()) {
          children.push(bodyParagraph(job.location));
        }
        job.bulletPoints.forEach((bp) => {
          if (!bp.trim()) return;
          const runs = htmlToDocxRuns(bp);
          children.push(
            new Paragraph({
              children:
                runs.length > 0
                  ? runs
                  : [new TextRun({ text: htmlToPlainText(bp), size: DOCX_SIZE_BODY })],
              bullet: { level: 0 },
            })
          );
        });
      });
    },
    education: () => {
      if (education.length === 0) return;
      children.push(sectionHeading(TEMPLATE1_SECTION_TITLES.education));
      education.forEach((edu) => {
        children.push(
          new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            children: [
              new TextRun({
                text: `${edu.degreeType}: ${edu.fieldOfStudy}, ${edu.institution}, ${edu.location}`,
                bold: true,
                size: DOCX_SIZE_BODY,
              }),
              new TextRun({ text: "\t", size: DOCX_SIZE_BODY }),
              new TextRun({
                text: `${edu.startYear} - ${edu.endYear}`,
                size: DOCX_SIZE_BODY,
              }),
            ],
          })
        );
      });
    },
    projects: () => {
      if (projects.length === 0) return;
      children.push(sectionHeading(TEMPLATE1_SECTION_TITLES.projects));
      projects.forEach((proj) => {
        children.push(
          new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            bullet: { level: 0 },
            children: [
              new TextRun({ text: `${proj.projectTitle}:`, bold: true, size: DOCX_SIZE_BODY }),
              new TextRun({ text: "\t", size: DOCX_SIZE_BODY }),
              new TextRun({ text: proj.date, bold: true, size: DOCX_SIZE_BODY }),
            ],
          })
        );
        const synopsis = htmlToPlainText(proj.synopsis);
        if (synopsis) {
          const runs = htmlToDocxRuns(proj.synopsis);
          children.push(
            new Paragraph({
              children: runs.length ? runs : [new TextRun({ text: synopsis, size: DOCX_SIZE_BODY })],
              bullet: { level: 0 },
            })
          );
        }
      });
    },
    languages: () => {
      if (languages.length === 0) return;
      children.push(sectionHeading(TEMPLATE1_SECTION_TITLES.languages));
      languages.forEach((lang) => {
        children.push(
          bodyParagraph(`${lang.language}: ${lang.proficiencyLabel} (${lang.cefrLevel})`)
        );
      });
    },
    certifications: () => {
      if (certifications.length === 0) return;
      children.push(sectionHeading(TEMPLATE1_SECTION_TITLES.certifications));
      certifications.forEach((cert) => {
        children.push(
          new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            children: [
              new TextRun({
                text: `${cert.certName} (${cert.issuer})`,
                size: DOCX_SIZE_BODY,
              }),
              new TextRun({ text: "\t", size: DOCX_SIZE_BODY }),
              new TextRun({ text: cert.date, bold: true, size: DOCX_SIZE_BODY }),
            ],
          })
        );
      });
    },
  };

  order.forEach((key) => sectionBuilders[key]());

  return children;
}

export async function exportAsDocx(
  data: ResumeData,
  filename: string,
  sectionOrder?: SectionKey[]
): Promise<void> {
  const order = sectionOrder?.length ? sectionOrder : TEMPLATE1_SECTION_ORDER;
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children: buildDocxChildren(data, order),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}

export async function exportAsPdf(
  data: ResumeData,
  filename: string,
  sectionOrder?: SectionKey[]
): Promise<void> {
  const order = sectionOrder?.length ? sectionOrder : TEMPLATE1_SECTION_ORDER;
  const element = React.createElement(ResumePdfDocument, { data, sectionOrder: order });
  const blob = await pdf(
    element as React.ReactElement<React.ComponentProps<typeof PdfDocument>>
  ).toBlob();
  saveAs(blob, filename);
}
