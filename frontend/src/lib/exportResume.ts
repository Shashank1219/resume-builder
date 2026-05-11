import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import type { ResumeData } from "@/types/resume";
import { ResumePdfDocument } from "./pdf/ResumePdfDocument";
import React from "react";

const getListItems = (html: string) => {
  if (!html) return [];
  if (typeof window !== "undefined") {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const items = Array.from(doc.body.querySelectorAll("li")).map((li) => li.textContent || "");
    if (items.length > 0) return items;
    return [doc.body.textContent || ""];
  }
  return [html.replace(/<[^>]+>/g, "")];
};

const stripHtml = (html: string) => {
  if (!html) return "";
  if (typeof window !== "undefined") {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  }
  return html.replace(/<[^>]+>/g, "");
};

export async function exportAsDocx(data: ResumeData, filename: string): Promise<void> {
  const { personalInfo, profile, skills, experience, education, projects } = data;

  const children: any[] = [];

  // Header
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: personalInfo.fullName || "Your Name",
          bold: true,
          size: 40,
        }),
      ],
    })
  );

  const contactInfo = [
    personalInfo.linkedinUrl,
    personalInfo.phone,
    [personalInfo.city, personalInfo.country].filter(Boolean).join(", "),
    personalInfo.email,
  ]
    .filter(Boolean)
    .join(" | ");

  if (contactInfo) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: contactInfo,
            size: 20,
          }),
        ],
      })
    );
  }

  // Profile
  if (profile.summaryText) {
    children.push(
      new Paragraph({
        text: "PROFILE",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
      })
    );
    children.push(
      new Paragraph({
        text: stripHtml(profile.summaryText),
      })
    );
  }

  // Experience
  if (experience.length > 0) {
    children.push(
      new Paragraph({
        text: "EXPERIENCE",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
      })
    );

    experience.forEach((exp) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.jobTitle, bold: true }),
            new TextRun({ text: `  |  ${exp.companyName}`, italics: true }),
          ],
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.location}  |  ${exp.startDate} - ${
                exp.isCurrent ? "Present" : exp.endDate
              }`,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        })
      );

      const items = getListItems(exp.bulletPoints.join(""));
      items.forEach((item) => {
        if (item.trim()) {
          children.push(
            new Paragraph({
              text: item.trim(),
              bullet: { level: 0 },
            })
          );
        }
      });
    });
  }

  // Education
  if (education.length > 0) {
    children.push(
      new Paragraph({
        text: "EDUCATION",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
      })
    );

    education.forEach((edu) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.institution, bold: true }),
            new TextRun({
              text: `  |  ${edu.startYear} - ${edu.endYear}`,
            }),
          ],
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.degreeType} ${edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}`,
            }),
            new TextRun({ text: `  |  ${edu.location}` }),
          ],
        })
      );
    });
  }

  // Projects
  if (projects.length > 0) {
    children.push(
      new Paragraph({
        text: "PROJECTS",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
      })
    );

    projects.forEach((proj) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: proj.projectTitle, bold: true }),
            new TextRun({ text: `  |  ${proj.date}` }),
          ],
        })
      );
      children.push(
        new Paragraph({
          text: stripHtml(proj.synopsis),
        })
      );
    });
  }

  // Skills
  if (skills.length > 0) {
    children.push(
      new Paragraph({
        text: "SKILLS",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
      })
    );

    skills.forEach((skill) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${skill.categoryName}: `, bold: true }),
            new TextRun({ text: skill.skills }),
          ],
        })
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}

export async function exportAsPdf(data: ResumeData, filename: string): Promise<void> {
  const element = React.createElement(ResumePdfDocument, { data }) as any;
  const blob = await pdf(element).toBlob();
  saveAs(blob, filename);
}
